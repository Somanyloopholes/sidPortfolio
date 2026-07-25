import React from 'react';

const helloWords: string[] = [
  "Hello", "Hola", "Bonjour", "Ciao", "Namaste", "Kon'nichiwa"
]

function helloSelecter(): number{
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  return(
    <section className='w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-start pt-2 md:pt-6 px-8 md:px-24 pb-24 md:pb-32'>
      <div className='flex flex-col items-start gap-2 md:gap-4 w-full max-w-[875px] text-left'>
        <h1 className='font-mono text-[33px] leading-[40px] md:text-[64px] md:leading-[48px] font-semibold text-[#A6D800] uppercase'>
          {helloWords[helloSelecter()]}
        </h1>
        <p className='font-jetbrains text-[20px] leading-[28px] text-white whitespace-pre-wrap'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </section>
  )
}


