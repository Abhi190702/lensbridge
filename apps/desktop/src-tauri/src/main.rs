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
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

#[cfg(target_os = "windows")]
const WEBVIEW_BROWSER_ARGS: &str =
    "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --disable-gpu --disable-gpu-compositing";

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let state = AppState::new();
            state.start_signaling_server();
            app.manage(state);

            let window = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("LensBridge Desktop")
                .inner_size(1180.0, 760.0)
                .min_inner_size(960.0, 640.0)
                .resizable(true)
                .center()
                .visible(true)
                .skip_taskbar(false)
                .focused(true)
                .additional_browser_args(webview_browser_args())
                .build()?;

            window.show()?;
            window.set_focus()?;
            window.set_title("LensBridge Desktop")?;

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

#[cfg(target_os = "windows")]
fn webview_browser_args() -> &'static str {
    WEBVIEW_BROWSER_ARGS
}

#[cfg(not(target_os = "windows"))]
fn webview_browser_args() -> &'static str {
    ""
}
