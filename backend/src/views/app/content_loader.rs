use std::fs;
use log::{error, info};

pub fn read_file(file_path: &str) -> String {
    let data: String = fs::read_to_string(file_path).expect("Unable to read file");
    data
}

pub fn add_component(component_tag: String, html_data: String) -> String {
    let tag_upper = component_tag.to_uppercase();
    let tag_lower = component_tag.to_lowercase();
    
    let css_placeholder = format!("{}_CSS", tag_upper);
    let html_placeholder = format!("{}_HTML", tag_upper);
    
    let css_path = format!("./templates/components/{}.css", tag_lower);
    let html_path = format!("./templates/components/{}.html", tag_lower);

    let css_content = match fs::read_to_string(&css_path) {
        Ok(content) => content,
        Err(e) => {
            error!("Error loading CSS for [{}]: {} (Path: {})", component_tag, e, css_path);
            String::from("/* CSS Load Error */")
        }
    };

    let html_content = match fs::read_to_string(&html_path) {
        Ok(content) => {
            info!("Component [{}] loaded successfully.", component_tag);
            content
        },
        Err(e) => {
            error!("Error loading HTML for [{}]: {} (Path: {})", component_tag, e, html_path);
            format!("<!-- HTML Load Error for {} -->", component_tag)
        }
    };

    let html_data = html_data.replace(&css_placeholder, &css_content);
    let html_data = html_data.replace(&html_placeholder, &html_content);
    
    html_data
}
