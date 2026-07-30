import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Mail, Phone } from "lucide-react";

export default function ContactPage(): React.JSX.Element {
  // Motion values for tracking mouse position
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Springs for smooth animation
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Tilt transforms
  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to 0 - 1
    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    // Reset to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <div style={{ perspective: "1000px" }} className="w-full max-w-[420px] aspect-[3.5/2]">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative mx-auto flex h-full w-full flex-col justify-between overflow-hidden rounded-[4px] bg-primary-background p-[clamp(16px,4vw,32px)] shadow-[0_30px_60px_rgba(0,0,0,0.8),0_15px_25px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-[#333336] transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_20px_30px_rgba(0,0,0,0.7)]"
        >
          {/* Reflective Sheen overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)",
              backgroundSize: "200% 200%",
              backgroundPositionX: useTransform(smoothX, [0, 1], ["100%", "0%"]),
              backgroundPositionY: useTransform(smoothY, [0, 1], ["100%", "0%"]),
            }}
          />

          <div
            className="z-20 flex flex-col items-center justify-start text-center font-mono"
            style={{ transform: "translateZ(30px)" }}
          >
            <h2
              className="font-semibold text-secondary-text uppercase"
              style={{ fontSize: "clamp(14px, 4vw, 18px)", letterSpacing: "-0.015em" }}
            >
              Siddharth
            </h2>
            <p
              className="mt-1 text-tertiary-text"
              style={{ fontSize: "clamp(9px, 2.5vw, 11px)", letterSpacing: "0.025em" }}
            >
              [ SOFTWARE ENGINEER ]
            </p>
          </div>

          <div
            className="z-20 flex flex-col gap-[clamp(8px,2vw,12px)] font-mono"
            style={{ transform: "translateZ(40px)" }}
          >
            <CopyableField icon={<Mail size={16} />} value="siddharth@example.com" />
            <CopyableField icon={<Phone size={16} />} value="+1 (555) 123-4567" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CopyableField({ icon, value }: { icon: React.ReactNode; value: string }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCopy}
      className="group flex cursor-pointer items-center gap-3 rounded bg-transparent px-2 py-1.5 text-secondary-text transition-colors hover:bg-[#333336]/40"
      style={{ fontSize: "clamp(10px, 3vw, 12px)" }}
    >
      <span className="text-tertiary-text group-hover:text-secondary-text transition-colors">{icon}</span>
      <span className="font-mono">
        {copied ? "[ COPIED TO CLIPBOARD ]" : hovered ? "[ COPY TO CLIPBOARD ]" : value}
      </span>
    </div>
  );
}
