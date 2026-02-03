use std::collections::HashMap;
use std::{env, fs};

use serde_yaml;

pub struct Config {
    pub map: HashMap<String, serde_yaml::Value>,
}

impl Config {
    pub fn new() -> Config {
        let args: Vec<String> = env::args().collect();
        println!("ARGS: {:?}", args);
        if args.len() < 2 {
            panic!("Usage: {} <config_file.yaml>", args[0]);
        }

        let file_path = &args[1];

        // Read file as bytes
        let mut contents = fs::read(file_path)
            .unwrap_or_else(|e| panic!("Failed to read config file '{}': {}", file_path, e));

        // Strip UTF-8 BOM if present
        if contents.starts_with(&[0xEF, 0xBB, 0xBF]) {
            contents = contents[3..].to_vec();
        }

        // Convert to string, replacing invalid UTF-8
        let contents_str = String::from_utf8_lossy(&contents);

        // Debug: print what we read
        println!("Reading config from: {}", file_path);
        println!("Content ({} bytes):", contents_str.len());
        println!("---");
        println!("{}", contents_str);
        println!("---");

        // Clean up: remove any non-breaking spaces or other invisible characters
        let cleaned = contents_str
            .replace('\u{FEFF}', "") // Remove zero width no-break space
            .replace('\u{00A0}', " ") // Replace non-breaking spaces with regular spaces
            .trim()
            .to_string();

        if cleaned.is_empty() {
            panic!("Config file '{}' is empty after cleaning", file_path);
        }

        // Try to parse YAML
        let map: HashMap<String, serde_yaml::Value> = serde_yaml::from_str(&cleaned)
            .unwrap_or_else(|e| {
                println!("YAML parsing error: {}", e);
                println!("Problematic content:");
                println!("{}", cleaned);
                panic!("Failed to parse YAML from '{}': {}", file_path, e);
            });

        Config { map }
    }
}
