pub fn detect_local_ip() -> Option<String> {
    local_ip_address::local_ip().ok().map(|ip| ip.to_string())
}

#[cfg(test)]
mod tests {
    use super::detect_local_ip;

    #[test]
    fn local_ip_returns_option() {
        let _ = detect_local_ip();
    }
}
