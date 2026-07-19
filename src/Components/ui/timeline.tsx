"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineEntry {
  type: "education" | "work";
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstIconRef = useRef<HTMLDivElement>(null);
  const lastIconRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [lineStart, setLineStart] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    // Using a ResizeObserver ensures that if the page reflows or fonts load, 
    // the height and line start are recalculated perfectly every time.
    const observer = new ResizeObserver(() => {
      if (firstIconRef.current && lastIconRef.current && ref.current) {
        // Calculate offset purely via DOM layout to ignore any CSS transforms (like hover scale)
        const getOffsetTop = (el: HTMLElement) => {
          let offset = 0;
          let curr = el;
          while (curr && curr !== ref.current) {
            offset += curr.offsetTop;
            curr = curr.offsetParent as HTMLElement;
          }
          return offset;
        };

        const startY = getOffsetTop(firstIconRef.current);
        const endY = getOffsetTop(lastIconRef.current) + lastIconRef.current.offsetHeight;

        setLineStart(startY);
        setHeight(endY - startY);
      }
    });

    observer.observe(ref.current);
    Array.from(ref.current.children).forEach(child => observer.observe(child));

    return () => observer.disconnect();
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // By changing end to 100%, the animated line will fully reach the bottom 
    // even if the user can't scroll past the bottom of the page.
    offset: ["start 10%", "end 100%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      /* 
        TWEAK VOID SPACE HERE:
        Adjust these padding classes (px-8, sm:px-12, md:px-24, lg:px-32) 
        to increase or decrease the empty space on the left and right sides.
      */
      className="w-full bg-transparent font-sans px-8 sm:px-12 md:px-24 lg:px-40"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h2 className="font-mono text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Journey
        </h2>
        <p className="font-mono text-neutral-400 max-w-2xl mx-auto">
          A chronological timeline of my education and professional experience.
        </p>
      </div>

      <div ref={ref} className="relative max-w-2xl mx-auto pb-20">
        {data.map((item, index) => {
          const isEducation = item.type === "education";
          const Icon = isEducation ? GraduationCap : Briefcase;

          const markerStyle = isEducation
            ? "bg-cyan-950 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            : "bg-rose-950 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]";

          return (
            <div
              key={index}
              className="relative w-full flex flex-col md:flex-row md:justify-center pt-10 md:pt-20 group"
            >
              {/* Marker */}
              <div
                ref={index === 0 ? firstIconRef : index === data.length - 1 ? lastIconRef : null}
                className="absolute left-8 md:left-1/2 top-10 md:top-20 flex h-10 w-10 md:h-12 md:w-12 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-app-bg z-40 transition-transform duration-300 group-hover:scale-110"
              >
                <div className={`flex h-full w-full items-center justify-center rounded-full border ${markerStyle}`}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                </div>
              </div>

              {/* Content Container */}
              <div className={`w-full pl-20 md:pl-0 md:w-[calc(50%-3rem)] ${isEducation ? 'md:mr-auto md:ml-0 md:text-right' : 'md:ml-auto md:text-left'}`}>
                {item.content}
              </div>
            </div>
          );
        })}

        {/* Animated Tracking Line */}
        <div
          style={{
            top: lineStart + "px",
            height: height + "px",
          }}
          className="absolute md:left-1/2 left-8 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-800 to-transparent to-[99%] md:-translate-x-1/2"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-rose-500 via-cyan-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
