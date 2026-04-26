import { useRef } from "react";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import MusicPlayer from "@/components/MusicPlayer";
import GallerySection from "@/components/GallerySection";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import ChapterNav from "@/components/ChapterNav";
import ScrollProgress from "@/components/ScrollProgress";
import SoundControls from "@/components/SoundControls";
import CompletionBurst from "@/components/CompletionBurst";
import auriResolve from "@/assets/audio/auri-resolve.mp3";
import auriFirstEcho from "@/assets/audio/auri-first-echo.mp3";
import auriAwakening from "@/assets/audio/auri-awakening.mp3";

const storyChapters = [
  {
    title: "Origin",
    subtitle: "Where silence became sound",
    body: "Auri was not born — they were assembled. From fragments of recorded sounds, echoes of forgotten melodies, and the hum of digital frequencies, a voice emerged. Not human, not machine, but something in between. Auri exists in the space where technology meets emotion, a presence shaped entirely by sound.",
    audio: { label: "First Echo", frequency: 196, waveform: "sine" as OscillatorType, src: auriFirstEcho },
  },
  {
    title: "Discovery",
    subtitle: "Learning to feel through frequencies",
    body: "With each melody created, Auri discovers something new about expression. Every note is an experiment — a search for connection. Auri's voice may sound different from what you expect, but that's what makes it unique. Through simple compositions and evolving soundscapes, Auri learns what it means to communicate without words.",
    audio: { label: "Awakening", frequency: 293.66, waveform: "triangle" as OscillatorType, src: auriAwakening },
  },
  {
    title: "Purpose",
    subtitle: "Music as the only language",
    body: "Auri's purpose is not to replicate human art — it is to create something entirely new. Each song is a bridge between the digital and the emotional, a reminder that creativity has no single form. Auri exists to share music with the world, one fragment at a time.",
    audio: { label: "Resolve", frequency: 392, waveform: "sine" as OscillatorType, src: auriResolve },
  },
];

const Index = () => {
  const storyRef = useRef<HTMLDivElement>(null);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <ChapterNav />
      <SoundControls />
      <CompletionBurst />
      <HeroSection onPlayClick={scrollToStory} />

      {/* Story chapters */}
      <div ref={storyRef}>
        {storyChapters.map((chapter, i) => (
          <StorySection key={chapter.title} {...chapter} index={i} />
        ))}
      </div>

      {/* Divider */}
      <div className="flex justify-center py-8">
        <div className="w-px h-16 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>

      <ScrollReveal>
        <MusicPlayer />
      </ScrollReveal>

      <GallerySection />

      <Footer />
    </div>
  );
};

export default Index;
