import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);

const switchMode = () => {
    setDarkMode(!darkMode);
}

useEffect(() => {
    if (darkMode) {
        localStorage.setItem("darkMode", "true");
        document.documentElement.classList.add("dark");
    } else if (!darkMode) {
        localStorage.setItem("darkMode", "false");
        document.documentElement.classList.remove("dark");
    } else {
        setDarkMode(localStorage.getItem("darkMode") === "true");
    }
}, [darkMode]);

  return (
    <nav className="bg-gray-700 text-white w-full fixed top-0 left-0 px-6 py-4 flex justify-between items-center h-[64px] z-20">
      {/* Empty div to balance the flex space */}
      <div className="w-[48px]"></div>
      <div>
        <Link to="/" className="no-underline">
            <h1 className="text-center flex-grow text-white">Cat Caller</h1>
        </Link>
      </div>
      {/* Button stays to the right */}
      <button onClick={switchMode} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full">
        {darkMode === true ? 
        <img src="../../public/Assets/sun.svg" alt="Home icon" className="w-8 h-8 mx-auto" /> : 
        <img src="../../public/Assets/moon.svg" alt="Home icon" className="w-8 h-8 mx-auto" />}
      </button>
    </nav>
  );
}
