import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Hero = () => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return (
        <div className="h-screen bg-cover bg-center flex justify-center items-center relative"
            style={{ backgroundImage: "url('/img/bgImg.jpg')" }}>
            <div className='absolute inset-0 bg-black opacity-70' />
            <div className='relative z-10 w-full max-w-[860px] text-white text-center'>
                <h1 className='text-4xl font-black md:text-5xl'>NOTEHIVE</h1>
                <p className='text-sm mt-5 font-light md:font-normal md:text-xl'>
                    Welcome to NoteHive, your go-to platform for sharing and accessing top-quality study notes. Upload, download, and exchange notes with students worldwide to enhance your learning and ace your exams. Join our community and elevate your studies with the collective knowledge at NoteHive!
                </p>
                <div className='mt-8'>
                    <AuthButtons isAuthenticated={isAuthenticated} />
                </div>
            </div>
        </div>
    );
};

const AuthButtons = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return (
            <Link to="/search" className="rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-black px-7 py-4 text-white hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500">Get Started</Link>
        );
    } else {
        return (
            <div className="flex items-center justify-center gap-5">
                <Link to='/login'>
                    <button className='rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-black px-7 py-4 text-white hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500'>
                        Login
                    </button>
                </Link>
                <Link to='/signup'>
                    <button className='rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-black px-7 py-4 text-white hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500'>
                        Signup
                    </button>
                </Link>
            </div>
        );
    }
};

export default Hero;
