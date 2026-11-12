import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface Greeting {
  text: string;
  lang: string;
}

const helloWords: Greeting[] = [
  { text: "Hello", lang: "en" },
  { text: "Hola", lang: "es" },
  { text: "Bonjour", lang: "fr" },
  { text: "Ciao", lang: "it" },
  { text: "Namaste", lang: "hi-Latn" },
  { text: "Kon'nichiwa", lang: "ja-Latn" },
]

function helloSelecter(): number {
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [greeting] = useState(() => helloWords[helloSelecter()]);

  useEffect(() => {
    document.title = 'Sid Geddam';
  }, []);

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-6 md:px-12 lg:px-48 xl:px-64 max-w-7xl mx-auto">
      <h1 className="sr-only">Siddharth Geddam, software engineer</h1>
      {/* Phones: stacked, content height (so the intro box doesn't stretch).
          Tablets and desktop: side by side, the row as tall as the video column, so both columns start and end level */}
      <div className="w-full flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-4 h-auto">

        {/* Left Column */}
        <div className="flex-1 md:min-w-0 flex flex-col gap-y-6 h-auto min-h-0">

          {/* Greeting Box: on tablets the greeting steps down to 48px so the longest one ("Kon'nichiwa") fits beside the video */}
          <div className="border border-hero-accent bg-primary-background px-3 py-1 md:p-6 flex items-center shrink-0">
            <p lang={greeting.lang} className="text-display-hero max-[374px]:text-[28px] md:max-lg:text-[48px] md:max-lg:leading-[48px] text-hero-accent uppercase">
              {greeting.text}
            </p>
          </div>

          {/* Intro Text Box */}
          <div className="border border-hero-accent bg-primary-background p-3 md:p-4 flex-grow md:overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <p className="text-statement-mono text-secondary-text whitespace-pre-wrap leading-relaxed">
              I'm Sid, a software engineer in Chicago who loves building things. I've worked across VR headsets, encrypted machine learning, and more recently AI, design systems, and UI/UX.
              <br />
              <span className="text-hero-accent">Always curious, always shipping.</span>
            </p>
          </div>

        </div>

        {/* Right Column (Video/Animation) */}
        {/* The column keeps the video's 9:16 shape so the whole clip shows and the border hugs it.
            Phones: a fixed height, centered under the text. Tablets and desktop: full row height
            (100vh minus navbar and bottom padding) when that fits, otherwise capped at 42% of the row width */}
        <div className="shrink-0 self-center aspect-[9/16] h-[350px] md:h-auto md:self-start md:w-[min(42%,calc((100vh-9.5rem)*9/16))] relative flex justify-center overflow-hidden bg-primary-background">
          <video
            aria-hidden="true"
            autoPlay={!prefersReducedMotion}
            loop={!prefersReducedMotion}
            muted
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full block object-contain pointer-events-none"
          >
            <source src="/landingPageDithered.mp4" type="video/mp4" />
          </video>

          {/* Border around the video column */}
          <div className="absolute inset-0 border border-hero-accent pointer-events-none" />

          {/* Scanline/Dot overlay to hide video pixelation/compression artifacts */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px]" />
        </div>

      </div>
    </section>
  )
}
