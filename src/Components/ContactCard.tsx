import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Mail } from 'lucide-react';

interface ContactCardProps {
  className?: string;
}

export default function ContactCard({ className = "" }: ContactCardProps) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for buttery animation
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Tilt ranges: increased for a more pronounced 3D effect
  const rotateX = useTransform(smoothY, [0, 1], [15, -15]);
  const rotateY = useTransform(smoothX, [0, 1], [-15, 15]);

  // Glare position optimized for compositor (using translation instead of background recalculation)
  const glareX = useTransform(smoothX, [0, 1], ["50%", "-50%"]);
  const glareY = useTransform(smoothY, [0, 1], ["50%", "-50%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className={`perspective-[1500px] flex w-full items-center justify-center ${className}`}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex flex-col justify-between overflow-hidden rounded-none bg-primary-background p-4 md:p-5 border border-[#333336] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]
          w-full aspect-[1/1.75] max-w-[min(280px,calc((100vh-200px)/1.75))]
          md:aspect-[1.75/1] md:max-w-[min(640px,calc((100vh-250px)*1.75))]"
      >
        {/* Topography Texture Background */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 opacity-40 scale-[1.07]"
          style={{ 
            backgroundImage: "url('/Topology.svg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center" 
          }}
        />

        {/* Dynamic Glare (Hardware Accelerated) */}
        <motion.div
          className="pointer-events-none absolute top-[-50%] left-[-50%] w-[200%] h-[200%] z-10 opacity-70"
          style={{
            x: glareX,
            y: glareY,
            background: "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, transparent 50%)",
            willChange: "transform"
          }}
        />

        {/* Center Content */}
        <div
          className="z-20 flex flex-col items-center justify-center absolute inset-0 pointer-events-none"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex flex-col items-center gap-0 -space-y-1 mt-[-2rem] md:mt-0">
            <h2 className="text-section-heading md:text-section-heading text-hero-accent uppercase pointer-events-auto">
              SIDDHARTH GEDDAM
            </h2>
            <p className="text-sub-heading text-secondary-text pointer-events-auto">
              Software engineer
            </p>
          </div>
        </div>

        {/* Top spacer for flex-between */}
        <div className="z-20 pointer-events-none" />

        {/* Footer Contacts */}
        <div
          className="z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-auto w-full"
          style={{ transform: "translateZ(50px)" }}
        >
          <CopyableField
            icon={<Mail className="w-4 h-4 md:w-5 md:h-5" />}
            value="siddharthgeddam@gmail.com"
          />
          <CopyableField
            icon={null}
            value="(312)468-7052"
          />
        </div>
      </motion.div>
    </div>
  );
}

function CopyableField({ icon, value }: { icon: React.ReactNode; value: string }) {
  const [copied, setCopied] = useState(false);

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
      onClick={handleCopy}
      className="group flex cursor-pointer items-center gap-2 text-hero-accent transition-opacity hover:opacity-80 w-fit"
    >
      {icon && <span>{icon}</span>}
      <span className={copied ? "text-micro-tag md:text-title-small font-jetbrains uppercase" : "text-micro-tag md:text-title-small"}>
        {copied ? "[ COPIED TO CLIPBOARD ]" : value}
      </span>
    </div>
  );
}
