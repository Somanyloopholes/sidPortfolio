import React from 'react';
import { Timeline } from '@/Components/ui/timeline';

export default function ExperiencePage() {
  const data = [
    {
      type: "work" as const,
      content: (
        <div className="rounded-2xl border border-rose-500/10 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.05)] w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div>
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-rose-300">Teaching Assistant</h3>
              <p className="text-neutral-300 font-medium text-sm mt-1">Illinois Institute of Technology, Chicago, IL</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-neutral-950/50 border border-neutral-800 text-rose-400">
              Sept 2025 - Dec 2025
            </span>
          </div>

        </div>
      ),
    },
    {
      type: "education" as const,
      content: (
        <div className="rounded-2xl border border-cyan-500/10 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)] w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-300">Master of Computer Science</h3>
              <p className="text-neutral-300 font-medium text-sm mt-1">Illinois Institute of Technology, Chicago, IL</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-neutral-950/50 border border-neutral-800 text-cyan-400">
              Aug 2024 - May 2026
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
            <span className="text-neutral-400 text-sm font-medium">GPA</span>
            <span className="text-white font-semibold">3.8</span>
          </div>
        </div>
      ),
    },
    {
      type: "work" as const,
      content: (
        <div className="rounded-2xl border border-rose-500/10 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.05)] w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div>
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-rose-300">Systems Engineer</h3>
              <p className="text-neutral-300 font-medium text-sm mt-1">Infosys Ltd, India</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-neutral-950/50 border border-neutral-800 text-rose-400">
              Nov 2022 - May 2024
            </span>
          </div>

        </div>
      ),
    },
    {
      type: "education" as const,
      content: (
        <div className="rounded-2xl border border-cyan-500/10 bg-neutral-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)] w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div className="text-left">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-300">Bachelor of Engineering, Computer Engineering</h3>
              <p className="text-neutral-300 font-medium text-sm mt-1">University of Mumbai, India</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-neutral-950/50 border border-neutral-800 text-cyan-400">
              Aug 2018 - May 2022
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-800/50 flex items-center justify-between">
            <span className="text-neutral-400 text-sm font-medium">GPA</span>
            <span className="text-white font-semibold">3.8</span>
          </div>
        </div>
      ),
    }
  ];

  return (
    <section className="min-h-[calc(100vh-3.5rem)] pb-12 w-full">
      <Timeline data={data} />
    </section>
  );
}
