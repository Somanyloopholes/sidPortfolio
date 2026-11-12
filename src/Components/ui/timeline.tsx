"use client";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";

interface TimelineEntry {
  type: "education" | "work";
  position?: "left" | "right";
  /** Icon shown large in the marker; defaults to a cap (education) or briefcase (work). */
  icon?: LucideIcon;
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
  // With reduced motion, show the progress line fully drawn instead of tying it to scroll.
  const prefersReducedMotion = useReducedMotion();

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
          const Icon = item.icon ?? (isEducation ? GraduationCap : Briefcase);

          const markerStyle = "bg-primary-background border border-hero-accent text-hero-accent";

          return (
            <div
              key={index}
              ref={index === 0 ? firstIconRef : index === data.length - 1 ? lastIconRef : null}
              className={`relative w-full flex flex-col lg:flex-row lg:justify-center group ${index === 0 ? "mt-0" : "mt-24 lg:mt-32"}`}
            >
              {/* Marker */}
              <div
                className="relative lg:absolute lg:left-1/2 lg:inset-y-0 flex w-full lg:w-24 lg:-translate-x-1/2 items-center justify-center rounded-none z-40 mb-4 lg:mb-0"
              >
                <div className={`flex h-12 lg:h-full w-full items-center justify-center rounded-none border ${markerStyle}`}>
                  <Icon className="h-8 w-8 lg:h-16 lg:w-16" strokeWidth={1.25} aria-hidden="true" />
                  <span className="sr-only">{isEducation ? "Education" : "Work"}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className={`w-full lg:w-[calc(50%-3.75rem)] ${
                item.position === 'left' 
                  ? 'lg:mr-auto lg:ml-0 lg:text-right' 
                  : item.position === 'right'
                    ? 'lg:ml-auto lg:text-left'
                    : isEducation ? 'lg:mr-auto lg:ml-0 lg:text-right' : 'lg:ml-auto lg:text-left'
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
              height: prefersReducedMotion ? height : heightTransform,
              opacity: prefersReducedMotion ? 1 : opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-hero-accent via-hero-accent to-transparent from-[0%] via-[10%] rounded-none"
          />
        </div>
      </div>
    </div>
  );
};
