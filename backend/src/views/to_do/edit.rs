use crate::diesel;
use crate::jwt::JwToken;
use crate::{
    database::establish_connection,
    json_serialization::{to_do_item::ToDoItem, to_do_items::ToDoItems},
    schema::to_do,
};
use actix_web::{HttpResponse, web};
use diesel::prelude::*;
use log::info;

pub async fn edit(to_do_item: web::Json<ToDoItem>, token: JwToken) -> HttpResponse {
    info!("JWT token message: {:?}", token);

    let mut connection = establish_connection();
    let resuts = to_do::table.filter(to_do::columns::title.eq(&to_do_item.title));

    let _ = diesel::update(resuts)
        .set(to_do::columns::status.eq("DONE"))
        .execute(&mut connection);

    HttpResponse::Ok().json(ToDoItems::get_state())
}
