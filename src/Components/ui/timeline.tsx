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
  position?: "left" | "right";
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
    target: ref,
    offset: ["start 60%", "end 100%"],
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
      <div className="hidden">
        {/* Removed duplicate The Journey header */}
      </div>

      <div ref={ref} className="relative max-w-2xl mx-auto pb-20">
        {data.map((item, index) => {
          const isEducation = item.type === "education";
          const Icon = isEducation ? GraduationCap : Briefcase;

          const markerStyle = "bg-primary-background border border-hero-accent text-hero-accent";

          return (
            <div
              key={index}
              ref={index === 0 ? firstIconRef : index === data.length - 1 ? lastIconRef : null}
              className={`relative w-full flex flex-col md:flex-row md:justify-center group ${index === 0 ? "mt-0" : "mt-24 md:mt-32"}`}
            >
              {/* Marker */}
              <div
                className="relative md:absolute md:left-1/2 md:inset-y-0 flex w-full md:w-24 md:-translate-x-1/2 items-center justify-center rounded-none z-40 mb-4 md:mb-0"
              >
                <div className={`flex h-12 md:h-full w-full items-center justify-center rounded-none border ${markerStyle}`}>
                  <Icon className="h-5 w-5 md:h-8 md:w-8" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content Container */}
              <div className={`w-full md:w-[calc(50%-3.75rem)] ${
                item.position === 'left' 
                  ? 'md:mr-auto md:ml-0 md:text-right' 
                  : item.position === 'right'
                    ? 'md:ml-auto md:text-left'
                    : isEducation ? 'md:mr-auto md:ml-0 md:text-right' : 'md:ml-auto md:text-left'
              }`}>
                {item.content}
              </div>
            </div>
          );
        })}

        <div
          style={{
            top: lineStart + "px",
            height: height + "px",
          }}
          className="absolute left-1/2 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-tertiary-text/30 to-transparent to-[99%] -translate-x-1/2 z-10"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-hero-accent via-hero-accent to-transparent from-[0%] via-[10%] rounded-none"
          />
        </div>
      </div>
    </div>
  );
};
