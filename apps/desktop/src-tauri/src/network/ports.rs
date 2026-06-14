use std::net::TcpListener;

pub fn find_available_port(start: u16) -> u16 {
    let end = start.saturating_add(40);

    (start..=end)
        .find(|port| TcpListener::bind(("0.0.0.0", *port)).is_ok())
        .unwrap_or(start)
}

#[cfg(test)]
mod tests {
    use super::find_available_port;

    #[test]
    fn high_start_port_does_not_overflow() {
        let _ = find_available_port(u16::MAX);
    }
}
