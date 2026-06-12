use rand::{distributions::Alphanumeric, thread_rng, Rng};

pub fn random_token(length: usize) -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::random_token;

    #[test]
    fn generates_requested_token_length() {
        assert_eq!(random_token(32).len(), 32);
    }

    #[test]
    fn generates_different_tokens() {
        assert_ne!(random_token(32), random_token(32));
    }
}
