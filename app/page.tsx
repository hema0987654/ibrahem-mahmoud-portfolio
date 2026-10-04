import { Hero } from "@/components/sections/Hero";
import { Trace } from "@/components/trace/Trace";
import { Systems } from "@/components/sections/Systems";
import { Evolution } from "@/components/sections/Evolution";
import { Stack } from "@/components/sections/Stack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Trace />
      <Systems />
      <Evolution />
      <Stack />
      <About />
      <Contact />
    </>
  );
}
