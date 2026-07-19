import React from 'react';

const helloWords: string[] = [
  "Hello", "Hola", "Bonjour", "Ciao", "Namaste", "Kon'nichiwa"
]

function helloSelecter(): number{
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  return(
    <section className='flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4 md:p-8'>
      <div className='flex w-full max-w-5xl flex-col md:flex-row items-center gap-8'>
        {/* Left column: Text Content */}
        <div className='flex flex-1 flex-col items-start gap-6 text-left'>
          <h1 className='font-mono text-4xl md:text-6xl font-bold tracking-tighter leading-none text-white'>
            {helloWords[helloSelecter()]}
          </h1>
          <p className='font-inter text-base md:text-lg text-neutral-300 leading-relaxed max-w-lg'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!
          </p>
        </div>
        {/* Right column: Fancy Animation Placeholder */}
        <div className='flex-1 w-full aspect-square md:aspect-[4/3] rounded-2xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(255,255,255,0.02)]'>
          <span className='font-mono text-neutral-500 tracking-wide text-sm uppercase'>[ Animation Container ]</span>
        </div>
      </div>
    </section>
  )
}


