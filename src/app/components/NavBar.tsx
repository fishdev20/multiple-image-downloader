'use client';

import { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { MdSimCardDownload } from 'react-icons/md';
import ThemeSwitch from './ThemeSwitch';

export default function NavBar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: 'Home' },
    { id: 2, text: 'Contact' },
  ];

  const renderMobileNav = () => {
    return (
      <ul
        className={
          nav
            ? 'fixed left-0 top-0 h-full w-[60%] border-r bg-white shadow-lg duration-500 ease-in-out dark:bg-gray-800 md:hidden'
            : 'fixed bottom-0 left-[-100%] top-0 h-full w-[60%] border-r bg-white shadow-lg duration-500 ease-in-out dark:bg-gray-900'
        }
      >
        {/* Mobile Logo */}
        <h1 className="m-4 flex w-full items-center text-3xl font-bold text-gray-900 dark:text-gray-200">
          IMAGE{' '}
          <span>
            <MdSimCardDownload />
          </span>
        </h1>
        {navItems.map((item) => (
          <li
            key={item.id}
            className="m-2 flex-1 cursor-pointer font-medium text-gray-900 duration-300 hover:text-cyan-700 dark:text-gray-300 dark:hover:text-cyan-500"
          >
            {item.text}
          </li>
        ))}
      </ul>
    );
  };

  const renderDesktopNav = () => {
    return (
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="m-2 cursor-pointer p-4 font-medium text-gray-900 duration-300 hover:text-cyan-700 dark:text-gray-300 dark:hover:text-cyan-500"
          >
            {item.text}
          </li>
        ))}
        <li className="m-2 cursor-pointer rounded-xl p-4 duration-300">
          <ThemeSwitch />
        </li>
      </ul>
    );
  };

  return (
    <nav className="sticky top-0 z-[60] mx-auto flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
      <h1 className=" flex w-full items-center text-3xl font-bold text-gray-900 dark:text-gray-200">
        IMAGE{' '}
        <span>
          <MdSimCardDownload />
        </span>
      </h1>
      {renderDesktopNav()}
      {/* Mobile Navigation Icon */}
      <div className="block flex items-center justify-between gap-4 md:hidden">
        <ThemeSwitch />
        {nav ? (
          <AiOutlineClose size={20} onClick={handleNav} />
        ) : (
          <AiOutlineMenu size={20} onClick={handleNav} />
        )}
      </div>
      {renderMobileNav()}
    </nav>
  );
}
