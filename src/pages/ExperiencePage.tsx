import { Timeline } from '@/Components/ui/timeline';

export default function ExperiencePage() {
  const data = [
    {
      type: "education" as const,
      position: "right" as const,
      content: (
        <div className="border border-hero-accent bg-primary-background relative z-20 p-6 w-full text-left">
          <h3 className="text-title-small text-secondary-text mb-2">Master of Computer Science</h3>
          <p className="text-body-prose text-tertiary-text">
            Illinois Institute of Technology,<br />
            Chicago, IL.
          </p>
          <p className="text-body-prose text-tertiary-text mt-4">Aug 2024 - May 2026</p>
        </div>
      ),
    },
    {
      type: "work" as const,
      position: "left" as const,
      content: (
        <div className="border border-hero-accent bg-primary-background relative z-20 p-6 w-full text-left">
          <h3 className="text-title-small text-secondary-text mb-2">Teaching assistant</h3>
          <p className="text-body-prose text-tertiary-text">
            Illinois Institute of Technology,<br />
            Chicago, IL.
          </p>
          <p className="text-body-prose text-tertiary-text mt-4">Sept 2025 - Dec 2025</p>
        </div>
      ),
    },
    {
      type: "work" as const,
      position: "left" as const,
      content: (
        <div className="border border-hero-accent bg-primary-background relative z-20 p-6 w-full text-left">
          <h3 className="text-title-small text-secondary-text mb-2">Systems Engineer</h3>
          <p className="text-body-prose text-tertiary-text">
            Infosys Ltd,<br />
            Pune, India
          </p>
          <p className="text-body-prose text-tertiary-text mt-4">Nov 2022 - May 2024</p>
        </div>
      ),
    },
    {
      type: "education" as const,
      position: "right" as const,
      content: (
        <div className="border border-hero-accent bg-primary-background relative z-20 p-6 w-full text-left">
          <h3 className="text-title-small text-secondary-text mb-2">Bachelor of Computer Engineering</h3>
          <p className="text-body-prose text-tertiary-text">
            University of Mumbai,<br />
            Mumbai, India
          </p>
          <p className="text-body-prose text-tertiary-text mt-4">Aug 2018 - May 2022</p>
        </div>
      ),
    }
  ];

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-4 md:px-8 lg:px-12">
      <div className="w-full flex flex-col gap-6">
        {/* Desktop Header Layout */}
        <div className="hidden md:block w-full h-[calc(100vh-3.5rem)] relative border border-hero-accent bg-primary-background shrink-0">
          <img 
            src="/expPageCover.png" 
            alt="The Journey So Far" 
            className="w-full h-full object-cover block" 
          />
          
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-primary-background border border-hero-accent py-1 px-3 md:py-2 md:px-4 shadow-xl max-w-lg">
            <h1 className="font-mono text-[40px] leading-[48px] lg:text-[48px] font-semibold text-hero-accent tracking-wide uppercase">
              The Journey So Far
            </h1>
            <p className="font-inter text-[16px] text-tertiary-text mt-1">
              A chronological timeline of my education and professional experience.
            </p>
          </div>
        </div>

        {/* Mobile Header Layout */}
        <div className="flex md:hidden flex-col gap-4 w-full">
          <div className="w-full relative border border-hero-accent bg-primary-background overflow-hidden shrink-0">
            <img 
              src="/expPageCover.png" 
              alt="The Journey So Far" 
              className="w-full h-auto block" 
            />
          </div>
          
          <div className="w-full bg-primary-background border border-hero-accent py-2 px-4 shadow-xl flex items-center justify-center text-center">
            <h1 className="font-mono text-[24px] leading-[28px] font-semibold text-hero-accent tracking-wide uppercase">
              The Journey So Far
            </h1>
          </div>
        </div>

        {/* Timeline wrapper to constrain width for readability if desired, or let it be full width */}
        <div className="w-full max-w-5xl mx-auto">
          <Timeline data={data} />
        </div>
      </div>
    </section>
  );
}
