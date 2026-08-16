import React from 'react';
import { landingPageVidBase64 } from '../assets/landingPageVidData';

const helloWords: string[] = [
  "Hello", "Hola", "Bonjour", "Ciao", "Namaste", "Kon'nichiwa"
]

function helloSelecter(): number {
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-12 md:px-32 lg:px-48 xl:px-64 max-w-7xl mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-4 h-auto md:h-full flex-grow">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-y-6 h-auto md:h-full min-h-0">

          {/* Greeting Box */}
          <div className="border border-hero-accent bg-primary-background px-3 py-1 md:p-6 flex items-center shrink-0">
            <h1 className="text-display-hero text-hero-accent uppercase">
              {helloWords[helloSelecter()]}
            </h1>
          </div>

          {/* Intro Text Box */}
          <div className="border border-hero-accent bg-primary-background p-3 md:p-4 flex-grow md:overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <p className="text-statement-mono text-secondary-text whitespace-pre-wrap leading-relaxed">
              I'm Sid, a software engineer in Chicago who loves building things. I've worked across VR headsets, encrypted machine learning, and more recently AI, design systems, and UI/UX.
              <br />
              Always curious, always shipping.
            </p>
          </div>

        </div>

        {/* Right Column (Video/Animation) */}
        <div className="shrink-0 h-[350px] md:h-full relative flex justify-center overflow-hidden bg-primary-background">
          <video
            autoPlay
            loop
            muted
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-auto h-full block object-contain pointer-events-none"
          >
            <source src={landingPageVidBase64} type="video/mp4" />
          </video>

          {/* Border perfectly wrapping the scaled video */}
          <div className="absolute inset-0 border border-hero-accent pointer-events-none" />

          {/* Scanline/Dot overlay to hide video pixelation/compression artifacts */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:4px_4px]" />
        </div>

      </div>
    </section>
  )
}
