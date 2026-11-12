import { useEffect, useState } from 'react';
import { ScrollRestoration, useLocation, useNavigationType, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { Analytics } from "@vercel/analytics/react";
import './App.css';
import Navbar from "./Components/Navbar.tsx";
import Dock from "./Components/Dock.tsx";
import PlusPatternBackground from "./Components/PlusPatternBackground.tsx";

const routeOrder = ['/', '/projects', '/experience', '/contact'];

function App() {
  const location = useLocation();
  const element = useOutlet();
  const lenis = useLenis();
  const navigationType = useNavigationType();

  const baseRoute = location.pathname.startsWith('/projects') ? '/projects' : location.pathname;
  const [routeState, setRouteState] = useState({ prev: baseRoute, direction: 1 });

  useEffect(() => {
    // Back/Forward (POP) keeps the restored scroll position from <ScrollRestoration />.
    if (navigationType === 'POP') return;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [baseRoute, lenis, navigationType]);

  let direction = routeState.direction;
  if (baseRoute !== routeState.prev) {
    const currentIndex = routeOrder.indexOf(baseRoute);
    const prevIndex = routeOrder.indexOf(routeState.prev);
    
    if (currentIndex !== -1 && prevIndex !== -1) {
      direction = currentIndex > prevIndex ? 1 : -1;
    }
    setRouteState({ prev: baseRoute, direction });
  }

  const variants = {
    // Short directional shift plus fade: keeps the sense of direction without a full-width slide.
    initial: (dir: number) => ({
      x: dir === 1 ? 24 : -24,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'tween' as const, ease: 'easeOut' as const, duration: 0.2 }
    },
    exit: (dir: number) => ({
      x: dir === 1 ? -24 : 24,
      opacity: 0,
      transition: { type: 'tween' as const, ease: 'easeIn' as const, duration: 0.15 }
    })
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-primary-background text-secondary-text font-inter overflow-x-clip relative'>
      <PlusPatternBackground />
      <Navbar />
      <main className='mt-[calc(2.5rem+1vh)] flex-1 flex w-full relative'>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={baseRoute}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transformTemplate={({ x }, generated) => {
              if (x === '0%' || x === 0) return 'none';
              return generated;
            }}
            className="w-full flex-1 flex flex-col items-center"
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </main>
      <Dock />
      <ScrollRestoration />
      <Analytics />
    </div>
  )
}

export default App
