import { NavLink } from "react-router-dom";
import { RiBriefcase3Line, RiHome4Line, RiMailLine, RiTerminalBoxLine, RiLinkedinBoxLine, RiGithubLine } from "react-icons/ri";

const dockRoutes = [
  { to: "/", label: "Home", icon: RiHome4Line, internal: true },
  { to: "/experience", label: "Experience", icon: RiBriefcase3Line, internal: true },
  { to: "/projects", label: "Projects", icon: RiTerminalBoxLine, internal: true },
  { to: "https://www.linkedin.com/in/siddharth-geddam/", label: "LinkedIn", icon: RiLinkedinBoxLine, internal: false },
  { to: "https://github.com/Somanyloopholes", label: "GitHub", icon: RiGithubLine, internal: false },
  { to: "/contact", label: "Contact", icon: RiMailLine, internal: true },
];

export default function Dock(): React.JSX.Element {
  return (
    <div className='fixed bottom-6 left-1/2 z-50 grid grid-flow-row grid-cols-3 md:flex h-fit w-fit -translate-x-1/2 md:flex-row items-center rounded-md border bg-black/50 px-2 py-2 backdrop-blur-sm shadow-lg'>
      {dockRoutes.map((route) => {
        const Icon = route.icon;

        if (!route.internal) {
          return (
            <a
              key={route.to}
              href={route.to}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={route.label}
              className='m-1 md:m-0.5 flex w-auto justify-center border p-3 md:p-1.5 transition hover:bg-white/10'
            >
              <Icon className='h-5 w-auto' />
            </a>
          );
        }

        return (
          <NavLink
            key={route.to}
            to={route.to}
            aria-label={route.label}
            className={({ isActive }) =>
              `m-1 md:m-0.5 flex w-auto justify-center border p-3 md:p-1.5 transition ${
                isActive ? "bg-white/20" : "bg-transparent hover:bg-white/10"
              }`
            }
          >
            <Icon className='h-5 w-auto' />
          </NavLink>
        );
      })}
    </div>
  )
}