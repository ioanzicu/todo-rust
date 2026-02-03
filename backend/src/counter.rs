use crate::config::Config;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Serialize, Deserialize, Debug)]
pub struct Counter {
    pub count: i32,
}

#[derive(Debug, Error)]
pub enum CounterError {
    #[error("Redis error: {0}")]
    Redis(#[from] redis::RedisError),
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_yaml::Error),
    #[error("Configuration error: {0}")]
    Config(String),
}

impl Counter {
    fn get_redis_url() -> Result<String, CounterError> {
        let config = Config::new();
        config
            .map
            .get("REDIS_URL")
            .ok_or_else(|| CounterError::Config("REDIS_URL not found".to_string()))?
            .as_str()
            .ok_or_else(|| CounterError::Config("REDIS_URL is not a string".to_string()))
            .map(|s| s.to_owned())
    }

    fn get_connection() -> Result<redis::Connection, CounterError> {
        let url = Self::get_redis_url()?;
        let client = redis::Client::open(url)?;
        let con = client.get_connection()?;
        Ok(con)
    }

    pub fn save(&self) -> Result<(), CounterError> {
        let serialized = serde_yaml::to_string(&self)?;
        let mut con = Self::get_connection()?;

        // SET command returns "OK" as a string
        let _: String = redis::cmd("SET")
            .arg("COUNTER")
            .arg(serialized)
            .query(&mut con)?;

        Ok(())
    }

    pub fn load() -> Result<Counter, CounterError> {
        let mut con = Self::get_connection()?;

        // GET returns an Option because the key might not exist
        let result: Option<String> = redis::cmd("GET").arg("COUNTER").query(&mut con)?;

        match result {
            Some(yaml_string) => Ok(serde_yaml::from_str(&yaml_string)?),
            None => {
                // Return default Counter if key doesn't exist
                Ok(Counter { count: 0 })
            }
        }
    }
}
