
import { Timeline } from '@/Components/ui/timeline';

export default function ExperiencePage() {
  const data = [
    {
      type: "work" as const,
      content: (
        <div className="rounded-2xl border border-timeline-work/10 bg-primary-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-timeline-work/30 hover:shadow-[0_0_20px] hover:shadow-timeline-work/5 w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div>
              <h3 className="text-xl font-bold text-secondary-text transition-colors group-hover:text-timeline-work">Teaching Assistant</h3>
              <p className="text-tertiary-text font-medium text-sm mt-1">Illinois Institute of Technology, Chicago, IL</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-primary-background border border-border text-timeline-work">
              Sept 2025 - Dec 2025
            </span>
          </div>

        </div>
      ),
    },
    {
      type: "education" as const,
      content: (
        <div className="rounded-2xl border border-timeline-edu/10 bg-primary-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-timeline-edu/30 hover:shadow-[0_0_20px] hover:shadow-timeline-edu/5 w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div className="text-left">
              <h3 className="text-xl font-bold text-secondary-text transition-colors group-hover:text-timeline-edu">Master of Computer Science</h3>
              <p className="text-tertiary-text font-medium text-sm mt-1">Illinois Institute of Technology, Chicago, IL</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-primary-background border border-border text-timeline-edu">
              Aug 2024 - May 2026
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-tertiary-text text-sm font-medium">GPA</span>
            <span className="text-secondary-text font-semibold">3.8</span>
          </div>
        </div>
      ),
    },
    {
      type: "work" as const,
      content: (
        <div className="rounded-2xl border border-timeline-work/10 bg-primary-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-timeline-work/30 hover:shadow-[0_0_20px] hover:shadow-timeline-work/5 w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div>
              <h3 className="text-xl font-bold text-secondary-text transition-colors group-hover:text-timeline-work">Systems Engineer</h3>
              <p className="text-tertiary-text font-medium text-sm mt-1">Infosys Ltd, India</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-primary-background border border-border text-timeline-work">
              Nov 2022 - May 2024
            </span>
          </div>

        </div>
      ),
    },
    {
      type: "education" as const,
      content: (
        <div className="rounded-2xl border border-timeline-edu/10 bg-primary-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-timeline-edu/30 hover:shadow-[0_0_20px] hover:shadow-timeline-edu/5 w-full">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-4 gap-2 xl:gap-0">
            <div className="text-left">
              <h3 className="text-xl font-bold text-secondary-text transition-colors group-hover:text-timeline-edu">Bachelor of Engineering, Computer Engineering</h3>
              <p className="text-tertiary-text font-medium text-sm mt-1">University of Mumbai, India</p>
            </div>
            <span className="text-sm font-semibold shrink-0 rounded-full px-3 py-1 bg-primary-background border border-border text-timeline-edu">
              Aug 2018 - May 2022
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-tertiary-text text-sm font-medium">GPA</span>
            <span className="text-secondary-text font-semibold">3.8</span>
          </div>
        </div>
      ),
    }
  ];

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-12 pb-24 px-4">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <Timeline data={data} />
      </div>
    </section>
  );
}
