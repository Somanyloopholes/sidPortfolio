import { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import './App.css';
import Navbar from "./Components/Navbar.tsx";
import Dock from "./Components/Dock.tsx";
import PlusPatternBackground from "./Components/PlusPatternBackground.tsx";

const routeOrder = ['/', '/projects', '/experience', '/contact'];

function App() {
  const location = useLocation();
  const element = useOutlet();
  
  const prevLocation = useRef(location.pathname);
  const prevDirection = useRef(1);

  let direction = prevDirection.current;
  if (location.pathname !== prevLocation.current) {
    const currentIndex = routeOrder.indexOf(location.pathname);
    const prev = routeOrder.indexOf(prevLocation.current);
    
    if (currentIndex !== -1 && prev !== -1) {
      direction = currentIndex > prev ? 1 : -1;
      prevDirection.current = direction;
    }
    prevLocation.current = location.pathname;
  }

  const variants = {
    initial: (dir: number) => ({
      x: dir === 1 ? '100%' : '-100%',
      opacity: 0
    }),
    animate: {
      x: '0%',
      opacity: 1,
      transition: { type: 'tween' as const, ease: 'easeInOut' as const, duration: 0.3 }
    },
    exit: (dir: number) => ({
      x: dir === 1 ? '-100%' : '100%',
      opacity: 0,
      transition: { type: 'tween' as const, ease: 'easeInOut' as const, duration: 0.3 }
    })
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-[#141413] text-[#faf9f5] font-inter overflow-x-hidden relative'>
      <PlusPatternBackground />
      <Navbar />
      <main className='mt-14 flex-1 flex w-full relative'>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex-1 flex flex-col items-center"
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </main>
      <Dock />
    </div>
  )
}

export default App
