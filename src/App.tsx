import './App.css'
import Navbar from "./Components/Navbar.tsx";
import Dock from "./Components/Dock.tsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className='flex min-h-screen w-full flex-col bg-app-bg text-app-text'>
      <Navbar />
      <main className='mt-14 flex-1'>
        <Outlet />
      </main>
      <Dock />
    </div>
  )
}

export default App
