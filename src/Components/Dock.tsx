import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, FolderCode, Mail } from "lucide-react";
import { AnimatedThemeToggler } from "@/Components/ui/animated-theme-toggler";
import { Dock as MotionDock, DockIcon, DockItem, DockLabel } from "@/Components/motion-primitives/dock";

const CustomGithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-full"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
  </svg>
);

const CustomLinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
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
  { to: "/projects", externalUrl: "", label: "Projects", icon: FolderCode, internal: true },
  { to: "/experience", externalUrl: "", label: "Experience", icon: Briefcase, internal: true },
  { to: "/contact", externalUrl: "", label: "Contact", icon: Mail, internal: true },
  { to: "", externalUrl: "https://www.linkedin.com/in/siddharth-geddam/", label: "LinkedIn", icon: CustomLinkedinIcon, internal: false },
  { to: "", externalUrl: "https://github.com/Somanyloopholes", label: "GitHub", icon: CustomGithubIcon, internal: false },
];

export default function Dock() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-2 md:bottom-8 left-1/2 z-50 -translate-x-1/2 w-auto flex justify-center scale-90 sm:scale-100 origin-bottom">
      <MotionDock 
        panelHeight={48} 
        magnification={80}
        distance={100}
        className="items-center justify-center rounded-xl bg-[#1e1e1e]/40 border border-white/10 shadow-2xl backdrop-blur-sm dark:bg-[#1e1e1e]/40 gap-1 sm:gap-3 px-2 sm:px-5"
      >
        {dockRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = route.internal && location.pathname === route.to;
          
          return (
            <DockItem
              key={route.label}
              onClick={() => {
                if (route.internal) {
                  navigate(route.to);
                } else {
                  window.open(route.externalUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className={isActive ? "text-[#A6D800]" : "text-neutral-400 hover:text-white transition-colors"}
            >
              <DockLabel className="hidden sm:block">{route.label}</DockLabel>
              <DockIcon className="relative">
                <Icon className="size-full" />
              </DockIcon>
            </DockItem>
          );
        })}
        
        <DockItem className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <DockLabel className="hidden sm:block">Theme</DockLabel>
          <DockIcon className="relative">
            <AnimatedThemeToggler className="size-full" />
          </DockIcon>
        </DockItem>
      </MotionDock>
    </div>
  );
}
