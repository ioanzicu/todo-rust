use crate::diesel;
use crate::json_serialization::login::Login;
use crate::jwt::JwToken;
use crate::models::user::user::User;
use crate::schema::users;
use crate::{database::DB, json_serialization::login_response::LoginResponse};

use actix_web::{HttpResponse, Responder, web};
use diesel::prelude::*;

pub async fn login(credentials: web::Json<Login>, mut db: DB) -> impl Responder {
    let password = credentials.password.clone();

    let user_result = users::table
        .filter(users::columns::username.eq(credentials.username.clone()))
        .first::<User>(&mut db.connection);

    match user_result {
        Ok(user) => match user.verify(password) {
            true => {
                let token = JwToken::new(user.id);
                let raw_token = token.encode();
                let response = LoginResponse {
                    token: raw_token.clone(),
                };
                let body = serde_json::to_string(&response).unwrap();
                HttpResponse::Ok()
                    .append_header(("token", raw_token))
                    .json(body)
            }
            false => HttpResponse::Unauthorized().finish(),
        },
        Err(diesel::result::Error::NotFound) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::Conflict().finish(),
    }
}
