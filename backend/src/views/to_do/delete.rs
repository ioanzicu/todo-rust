use crate::{
    database::establish_connection,
    json_serialization::{to_do_item::ToDoItem, to_do_items::ToDoItems},
    models::item::item::Item,
};
use crate::{jwt::JwToken, schema::to_do};
use actix_web::{HttpResponse, web};
use diesel::prelude::*;

pub async fn delete(to_do_item: web::Json<ToDoItem>, token: JwToken) -> HttpResponse {
    let mut connection: PgConnection = establish_connection();

    let items: Vec<Item> = to_do::table
        .filter(to_do::columns::title.eq(&to_do_item.title.as_str()))
        .order(to_do::columns::id.asc())
        .load::<Item>(&mut connection)
        .unwrap();

    let _ = diesel::delete(&items[0]).execute(&mut connection);
    HttpResponse::Ok().json(ToDoItems::get_state())
}
