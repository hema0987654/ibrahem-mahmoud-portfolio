import { Hero } from "@/components/sections/Hero";
import { Evolution } from "@/components/sections/Evolution";
import { Stack } from "@/components/sections/Stack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Mount points for later phases: 01 The Trace, 02 Systems. Empty until built. */}
      <div id="trace" />
      <div id="systems" />
      <Evolution />
      <Stack />
      <About />
      <Contact />
    </>
  );
}
