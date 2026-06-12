#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![allow(dead_code)]

mod ai;
mod audio;
mod cleanup;
mod commands;
mod config;
mod errors;
mod media;
mod network;
mod pairing;
mod security;
mod signaling;
mod sources;
mod state;
mod transports;
mod virtual_cam;

use state::AppState;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let state = AppState::new();
            state.start_signaling_server();
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_pairing_session,
            commands::regenerate_pairing_session,
            commands::get_runtime_status,
            commands::disconnect_session,
            commands::list_source_statuses,
            commands::get_virtual_camera_status
        ])
        .run(tauri::generate_context!())
        .expect("failed to run LensBridge Desktop");
}
