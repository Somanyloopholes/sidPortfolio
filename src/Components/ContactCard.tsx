import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Check, Copy } from 'lucide-react';

interface ContactCardProps {
  className?: string;
}

export default function ContactCard({ className = "" }: ContactCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    // Keep the card flat when the user has asked for reduced motion.
    if (prefersReducedMotion) return;

    // Check if device requires permission (iOS 13+). If so, skip gyro to avoid user friction/popups.
    const isIOS =
      typeof window !== 'undefined' &&
      'DeviceOrientationEvent' in window &&
      typeof (window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })?.requestPermission === 'function';
    if (isIOS) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      
      // gamma (roll: left-to-right tilt). Natural center is 0 deg.
      // Make responsive within a natural ±25 deg wrist tilt range.
      const clampedGamma = Math.max(-25, Math.min(25, gamma));
      const mappedX = (clampedGamma + 25) / 50; // 0 to 1
      
      // beta (pitch: forward/back tilt). When reading on a phone, natural hold is ~50 deg.
      // Center around 50 deg with a ±25 deg window (25 to 75 deg).
      const clampedBeta = Math.max(25, Math.min(75, beta));
      const mappedY = (clampedBeta - 25) / 50; // 0 to 1
      
      mouseX.set(mappedX);
      mouseY.set(mappedY);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
        window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener);
      }
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, touch.clientY - rect.top));
    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
  };

  const handleTouchEnd = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div 
      className={`flex w-full items-center justify-center ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative flex flex-col justify-between overflow-hidden rounded-none bg-primary-background p-4 md:p-5 border border-tertiary-text/30 shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow duration-300 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]
          w-full aspect-[1/1.75] max-w-[280px]
          md:aspect-[1.75/1] md:max-w-[clamp(580px,calc((100vh-250px)*1.75),640px)]"
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
          <div className="flex flex-col items-center gap-1 md:gap-0 md:-space-y-1">
            <h2 className="font-mono text-[24px] leading-[32px] font-semibold md:text-[32px] md:leading-[40px] text-hero-accent uppercase pointer-events-auto text-center">
              SIDDHARTH GEDDAM
            </h2>
            <p className="font-mono text-[18px] leading-[24px] font-medium md:text-[25px] md:leading-[32px] text-secondary-text pointer-events-auto text-center">
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
          <ContactField
            label="email address"
            value="siddharthgeddam@gmail.com"
            href="mailto:siddharthgeddam@gmail.com"
          />
          <ContactField
            label="phone number"
            value="(312)468-7052"
            href="tel:+13124687052"
          />
        </div>
      </motion.div>
    </div>
  );
}

interface ContactFieldProps {
  label: string;
  value: string;
  href: string;
}

// The value is a direct mailto:/tel: link; the icon button next to it copies the value.
function ContactField({ label, value, href }: ContactFieldProps) {
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
    <div className="flex items-center gap-2 w-fit">
      <a
        href={href}
        className="font-mono text-[14px] leading-[20px] font-medium md:text-[20px] md:leading-[28px] text-hero-accent hover:underline underline-offset-4 py-2 -my-2"
      >
        {value}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className={`p-1 -m-1 cursor-pointer transition-colors ${copied ? "text-hero-accent" : "text-tertiary-text hover:text-hero-accent"}`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? `${label} copied to clipboard` : ""}</span>
    </div>
  );
}
