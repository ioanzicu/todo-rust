use log::info;

use actix_service::Service;
use actix_web::{App, HttpServer};

mod json_serialization;
mod jwt;
mod processes;
mod state;
mod to_do;
mod views;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    HttpServer::new(|| {
        let app = App::new()
            .wrap_fn(|req, srv| {
                info!("{:?}", req);

                let future = srv.call(req);
                async {
                    let result = future.await?;
                    Ok(result)
                }
            })
            .configure(views::views_factory);

        app
    })
    .bind("127.0.0.1:8000")?
    .workers(3)
    .run()
    .await
}
