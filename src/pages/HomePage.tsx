import React from 'react';

const helloWords: string[] = [
  "Hello", "Hola", "Bonjour", "Ciao", "Namaste", "Kon'nichiwa"
]

function helloSelecter(): number{
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  return(
    <section className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-start pt-0 pb-24 px-12 md:px-32 lg:px-48 xl:px-64 max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-full flex-grow">
        
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          
          {/* Greeting Box */}
          <div className="border border-hero-accent p-6 md:p-8 flex items-center">
            <h1 className="text-display-hero text-hero-accent uppercase">
              {helloWords[helloSelecter()]}
            </h1>
          </div>
          
          {/* Intro Text Box */}
          <div className="border border-hero-accent p-6 md:p-8 flex-grow">
            <p className="text-statement-mono text-secondary-text whitespace-pre-wrap leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          
        </div>
        
        {/* Right Column (Blank) */}
        <div className="border border-hero-accent w-full min-h-[400px] md:min-h-full">
          {/* Blank for future plans */}
        </div>
        
      </div>
    </section>
  )
}


