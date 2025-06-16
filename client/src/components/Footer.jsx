import React from 'react'
import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <footer className='flex justify-center items-center p-16'>

            <div className='flex h-full w-full flex-col gap-10 lg:justify-between px-20 lg:flex-row'>
                <div className='lg:w-[450px]'>
                    <h2 className='relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:w-[60px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                        About Us
                    </h2>
                    <p className='text-gray-600'>
                        Because your planning is not always perfect, need to be able to
                        study whenever, wherever. Just read your notes one last time on your
                        tablet, phone or laptop while you are on to go.
                    </p>
                </div>
                <div className=''>
                    <h2 className='relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:w-[60px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                        Quick Links
                    </h2>
                    <ul className='teaxt-gray-600'>
                        <li className='mb-1'>
                            <Link to="/about">
                                About
                            </Link>
                        </li>
                        <li className='mb-1'>
                            <Link to="/faq">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className=''>
                    <h2 className='before:w-[60px] relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                        Contact Info
                    </h2>
                    <ul className='teaxt-gray-600'>
                        <li className='mb-1'>
                            <Link to="/about">
                                +91 9001890408
                            </Link>
                        </li>

                        <li className='mb-1'>
                            <Link to="/faq">
                                deorasidharth@gmail.com
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

        </footer>
    )
}

export default Footer