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
        {/* Header Section */}
        <div className="w-full max-w-5xl mx-auto px-8 sm:px-12 md:px-24 lg:px-40 mb-[15vh] md:mb-[25vh]">
          <div className="w-full max-w-2xl mx-auto border border-hero-accent bg-primary-background py-2 px-4 md:py-4 md:px-6 flex flex-col items-center justify-center text-center">
            <h1 className="font-mono text-[32px] leading-[36px] md:text-[48px] md:leading-[56px] font-semibold text-hero-accent tracking-wide">
              The Journey so far
            </h1>
            <p className="font-inter text-[14px] md:text-[16px] text-tertiary-text mt-1 md:mt-2">
              A chronological timeline of my education and professional experience.
            </p>
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
