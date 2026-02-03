use crate::jwt::JwToken;
use crate::{database::DB, diesel};
use crate::{
    json_serialization::{to_do_item::ToDoItem, to_do_items::ToDoItems},
    schema::to_do,
};
use actix_web::{HttpResponse, web};
use diesel::prelude::*;

pub async fn edit(to_do_item: web::Json<ToDoItem>, token: JwToken, mut db: DB) -> HttpResponse {
    let resuts = to_do::table
        .filter(to_do::columns::title.eq(&to_do_item.title))
        .filter(to_do::columns::user_id.eq(&token.user_id));

    let _ = diesel::update(resuts)
        .set(to_do::columns::status.eq("DONE"))
        .execute(&mut db.connection);

    HttpResponse::Ok().json(ToDoItems::get_state(token.user_id))
}
