import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Briefcase, FolderCode, Mail } from "lucide-react";
import { Dock as MagicDock, DockIcon } from "@/Components/ui/dock";
import { AnimatedThemeToggler } from "@/Components/ui/animated-theme-toggler";

const CustomGithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none" // Forces wireframe outline mode
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-full" // Keeps Magic UI scaling uniform
    {...props}           // Spreads Framer Motion physics metrics down safely
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  </svg>
);

const CustomLinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none" // Forces wireframe outline mode
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-full"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 11v5" />
    <path d="M8 8v.01" />
    <path d="M12 16v-5" />
    <path d="M16 16v-3a2 2 0 0 0 -4 0" />
    <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
  </svg>
);

export type RouteConfig = {
  to: string;
  externalUrl: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  internal: boolean;
};

const dockRoutes: RouteConfig[] = [
  { to: "/", externalUrl: "", label: "Home", icon: Home, internal: true },
  { to: "/experience", externalUrl: "", label: "Timeline", icon: Briefcase, internal: true },
  { to: "/projects", externalUrl: "", label: "Projects", icon: FolderCode, internal: true },
  { to: "", externalUrl: "https://www.linkedin.com/in/siddharth-geddam/", label: "LinkedIn", icon: CustomLinkedinIcon, internal: false },
  { to: "", externalUrl: "https://github.com/Somanyloopholes", label: "GitHub", icon: CustomGithubIcon, internal: false },
  { to: "/contact", externalUrl: "", label: "Contact", icon: Mail, internal: true },
];

export default function Dock() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <MagicDock direction="middle">
        {dockRoutes.map((route) => {
          const Icon = route.icon;

          if (!route.internal) {
            return (
              <DockIcon key={route.label}>
                <a
                  href={route.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={route.label}
                  className="flex h-full w-full items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-5" />
                </a>
              </DockIcon>
            );
          }

          return (
            <DockIcon key={route.to}>
              <NavLink
                to={route.to}
                aria-label={route.label}
                className={({ isActive }) =>
                  `flex h-full w-full items-center justify-center rounded-full transition-colors ${isActive ? "bg-white/20 text-white" : "text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="size-5" />
              </NavLink>
            </DockIcon>
          );
        })}
        <DockIcon>
          <AnimatedThemeToggler className="flex h-full w-full items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white [&_svg]:size-5" />
        </DockIcon>
      </MagicDock>
    </div>
  );
}

