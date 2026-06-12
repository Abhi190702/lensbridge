use std::net::TcpListener;

pub fn find_available_port(start: u16) -> u16 {
    (start..start + 40)
        .find(|port| TcpListener::bind(("127.0.0.1", *port)).is_ok())
        .unwrap_or(start)
}
