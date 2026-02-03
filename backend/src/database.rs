use actix_web::dev::Payload;
use actix_web::error::ErrorServiceUnavailable;
use actix_web::{Error, FromRequest, HttpRequest};
use std::sync::OnceLock;

use crate::config::Config;
use diesel::{
    pg::PgConnection,
    r2d2::{ConnectionManager, Pool, PooledConnection},
};
use futures::future::{err, ok, Ready};
use lazy_static::lazy_static;

type PgPool = Pool<ConnectionManager<PgConnection>>;

pub struct DbConnection {
    pub db_connection: PgPool,
}

static DBCONNECTION: OnceLock<DbConnection> = OnceLock::new();

fn init_db_connection() -> Result<DbConnection, String> {
    let config = Config::new();
    let connection_string = config
        .map
        .get("DB_URL")
        .ok_or_else(|| "DB_URL not found in config".to_string())?
        .as_str()
        .ok_or_else(|| "DB_URL is not a string".to_string())?
        .to_string();

    let pool = PgPool::builder()
        .max_size(8)
        .build(ConnectionManager::new(connection_string))
        .map_err(|e| format!("failed to create db connection pool: {}", e))?;

    Ok(DbConnection {
        db_connection: pool,
    })
}

pub fn establish_connection() -> PooledConnection<ConnectionManager<PgConnection>> {
    let db_conn = DBCONNECTION
        .get_or_init(|| init_db_connection().expect("Failed to initialize database connection"));

    db_conn
        .db_connection
        .get()
        .expect("Failed to get connection from pool")
}

pub struct DB {
    pub connection: PooledConnection<ConnectionManager<PgConnection>>,
}

impl FromRequest for DB {
    type Error = Error;
    type Future = Ready<Result<DB, Error>>;

    fn from_request(_: &HttpRequest, _: &mut Payload) -> Self::Future {
        match DBCONNECTION.get() {
            Some(db_conn) => match db_conn.db_connection.get() {
                Ok(connection) => return ok(DB { connection }),
                Err(e) => {
                    log::error!("Failed to get database connection: {}", e);

                    err(ErrorServiceUnavailable("Databse connection error"))
                }
            },
            None => match init_db_connection() {
                Ok(db_conn) => {
                    let _ = DBCONNECTION.set(db_conn);
                    match DBCONNECTION.get().unwrap().db_connection.get() {
                        Ok(connection) => ok(DB { connection }),
                        Err(e) => {
                            log::error!("Failed to get connection after init: {}", e);
                            err(ErrorServiceUnavailable("Database connection error"))
                        }
                    }
                }
                Err(e) => {
                    log::error!("Failed to initialize database: {}", e);
                    err(ErrorServiceUnavailable("Database initialization failed"))
                }
            },
        }
    }
}
