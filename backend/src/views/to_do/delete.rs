use crate::database::DB;
use crate::{
    database::establish_connection,
    json_serialization::{to_do_item::ToDoItem, to_do_items::ToDoItems},
    models::item::item::Item,
};
use crate::{jwt::JwToken, schema::to_do};
use actix_web::{HttpResponse, web};
use diesel::prelude::*;

pub async fn delete(to_do_item: web::Json<ToDoItem>, token: JwToken, mut db: DB) -> HttpResponse {
    let items: Vec<Item> = to_do::table
        .filter(to_do::columns::title.eq(&to_do_item.title.as_str()))
        .filter(to_do::columns::user_id.eq(&token.user_id))
        .load::<Item>(&mut db.connection)
        .unwrap();

    let _ = diesel::delete(&items[0]).execute(&mut db.connection);

    HttpResponse::Ok().json(ToDoItems::get_state(token.user_id))
}
