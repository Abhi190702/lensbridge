import { Architecture } from "./sections/Architecture";
import { Features } from "./sections/Features";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Roadmap } from "./sections/Roadmap";

export default function App() {
  return (
    <main>
      <Hero />
      <Features />
      <Architecture />
      <Roadmap />
      <Footer />
    </main>
  );
}
