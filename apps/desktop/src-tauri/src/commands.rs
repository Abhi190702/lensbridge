use crate::{
    errors::LensBridgeResult,
    pairing::qr_payload::PairingPayload,
    sources::source_manager::SourceManager,
    state::{AppState, RuntimeStatus},
    virtual_cam::manager::{ObsVirtualCameraStatus, VirtualCameraManager, VirtualCameraStatus},
};

#[tauri::command]
pub fn get_pairing_session(state: tauri::State<'_, AppState>) -> LensBridgeResult<PairingPayload> {
    Ok(state.pairing_payload())
}

#[tauri::command]
pub fn regenerate_pairing_session(state: tauri::State<'_, AppState>) -> LensBridgeResult<PairingPayload> {
    Ok(state.regenerate_pairing_payload())
}

#[tauri::command]
pub fn get_runtime_status(state: tauri::State<'_, AppState>) -> LensBridgeResult<RuntimeStatus> {
    Ok(state.runtime_status())
}

#[tauri::command]
pub fn disconnect_session(state: tauri::State<'_, AppState>) -> LensBridgeResult<()> {
    state.session_manager.clear_active_device();
    Ok(())
}

#[tauri::command]
pub fn list_source_statuses() -> LensBridgeResult<Vec<crate::sources::source_trait::SourceDescriptor>> {
    Ok(SourceManager::default().list())
}

#[tauri::command]
pub fn get_virtual_camera_status() -> LensBridgeResult<VirtualCameraStatus> {
    Ok(VirtualCameraManager::default().status())
}

#[tauri::command]
pub fn get_obs_virtual_camera_status() -> LensBridgeResult<ObsVirtualCameraStatus> {
    Ok(VirtualCameraManager::default().obs_virtual_camera_status())
}
