use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::Path;

use serde_json::Map;
use serde_json::json;
use serde_json::value::Value;

pub fn read_file(file_name: &str) -> Map<String, Value> {
    // use the Cargo project path as root
    let project_root = env!("CARGO_MANIFEST_DIR");
    let f: std::path::PathBuf = Path::new(project_root).join(file_name);
    let mut file: File = File::open(f).unwrap();

    let mut data: String = String::new();
    file.read_to_string(&mut data).unwrap();

    let json: Value = serde_json::from_str(&data).unwrap();
    let state: Map<String, Value> = json.as_object().unwrap().clone();

    state
}

pub fn write_to_file(file_name: &str, state: &mut Map<String, Value>) {
    let new_data: Value = json!(state);
    fs::write(file_name.to_string(), new_data.to_string()).expect("Unable to write file");
}
