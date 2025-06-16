// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { removeUserData } from '../Redux/slices/user-slice';
import { persistor } from '../Redux/store';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(removeUserData());
    persistor.purge();
    navigate('/');
  };

  return (
    <header className='h-[80px] flex justify-center items-center shadow-md'>
      <div className='mx-5 w-full max-w-[1500px] flex justify-between items-center'>

        {/* Logo */}
        <Link to="/" className='text-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg'>
          NoteHive
        </Link>

        {/* Nav Links */}
        <GiHamburgerMenu className='text-xl md:hidden' />

        <div className='hidden md:flex gap-4 items-center font-semibold'>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>

          {isAuthenticated ? (
            <>
              <Link to="/search"><FaSearch className='text-xl' /></Link>
              <Link to="/upload"><LuUpload className='text-2xl' /></Link>
              <Link to="/profile">
                <button className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg'>Profile</button>
              </Link>
              <button onClick={handleLogout} className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg'>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg'>Login</button>
              </Link>
              <Link to="/signup">
                <button className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg'>Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
