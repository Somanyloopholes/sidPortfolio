const helloWords: string[] = [
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "Namaste",
  "Kon'nichiwa"
]

function helloSelecter(): number{
  return Math.floor(Math.random() * helloWords.length);
}

export default function HomePage(): React.JSX.Element {
  return(
    <div className='w-screen p-6 md:px-55'>
      <div className='pb-6'>
        {helloWords[helloSelecter()]}
      </div>

      <div >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur autem blanditiis consectetur delectus deserunt ex iure natus nemo placeat porro quaerat, ullam ut? Atque autem culpa doloribus sequi sint!</div>
    </div>
  )
}


