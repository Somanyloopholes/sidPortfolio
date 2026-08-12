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
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-2 md:pt-4 pb-24 px-4">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <Timeline data={data} />
      </div>
    </section>
  );
}
