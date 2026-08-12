export default function PlusPatternBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern 
              id="plus-pattern" 
              width="32" 
              height="32" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                d="M 16 12.5 L 16 19.5 M 12.5 16 L 19.5 16" 
                fill="none" 
                stroke="#A1A1AA" 
                strokeWidth="1" 
                opacity="0.35"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#plus-pattern)" />
        </svg>
      </div>
    </div>
  );
}
