type TimelineItem = {
  id: string;
  title: string;
  organization: string;
  period: string;
  location: string;
  highlights: string[];
};

export const workItems: TimelineItem[] = [
  {
    id: "work-1",
    title: "Systems Engineer",
    organization: "Infosys",
    period: "Nov 2022 - May 2024",
    location: "Pune, India",
    highlights: [
      "Ensured seamless operation of critical IT infrastructure (Servers, VMs) for Starhub, a Singaporean telecommunication conglomerate, using Dynatrace and ServiceNow to detect anomalies, reducing unplanned downtime by 40%.",
      "Collaborated with cross-functional teams to troubleshoot and resolve technical incidents, improving SLA compliance by 25%",
      "Led on-the-job training for a team of 8, developing training materials and ensuring readiness for infrastructure monitoring responsibilities",
    ],
  },
  {
    id: "work-2",
    title: "Teaching Assistant - Systems Programming (CS 351) ",
    organization: "Illinois Institute of Technology",
    period: "Sept 2025 - Dec 2025",
    location: "Chicago, IL",
    highlights: [
      "Held weekly office hours supporting 70+ students and assisted with grading course material development",
    ],
  },
];

export const educationItems: TimelineItem[] = [
  {
    id: "edu-1",
    title: "B.E. in Computer Engineering",
    organization: "University of Mumbai",
    period: "2018 - 2022",
    location: "Mumbai, India",
    highlights: [
      "",
    ],
  },
  {
    id: "edu-2",
    title: "Masters in Computer Science",
    organization: "Illinois Institute of Technology",
    period: "2024 - 2026",
    location: "Chi",
    highlights: [
      "Studied mathematics, physics, and computer science.",
    ],
  },
];


export default function ExperiencePage(): React.JSX.Element {
  return <section className="min-h-[calc(100vh-3.5rem)]" />;
}

