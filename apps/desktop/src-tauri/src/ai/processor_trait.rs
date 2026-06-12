pub trait AiProcessor {
    fn name(&self) -> &'static str;
    fn enabled(&self) -> bool;
    fn initialize(&mut self) -> Result<(), String>;
    fn dispose(&mut self);
}
