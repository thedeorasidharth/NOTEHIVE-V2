import React from 'react'

const About = () => {
    return (
        <div className='h-heightWithoutNavbar flex flex-col items-center justify-start p-5 lg:flex-row'>

            <div className=' grid h-full w-full place-content-center'>
                <img src="./aboutUs.svg" className='w-[300px] sm:w-[400px] md:w-[450px] lg:w-[600px]' alt="" />
            </div>

            <div className='flex h-full  w-full flex-col items-center justify-center mt-8'>
                <div className=''>
                    <h1 className='relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:w-[98px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-l'>About Us</h1>
                    <p className='mt-1 text-[15px] lg:mt-3'>Welcome to NoteHive, your ultimate destination for sharing and accessing high-quality study notes. Designed with students in mind, NoteHive offers a seamless platform where you can upload, download, and exchange notes with peers from around the world. Whether you're preparing for exams, working on assignments, or just looking to deepen your understanding of a subject, NoteHive provides the resources you need to succeed.
                    </p>
                </div>

                <div className=''>
                    <h1 className='relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:w-[98px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-l'>Who We Are</h1>
                    <p className='mt-1 text-[15px] lg:mt-3'>At NoteHive, we are a dedicated community of students committed to enhancing the learning experience through sharing. Our platform empowers students to upload, access, and exchange high-quality notes, fostering a collaborative environment where knowledge thrives. Whether you're looking to excel in exams or deepen your understanding of a subject, NoteHive is here to support your academic journey with the collective wisdom of students from around the globe.</p>
                </div>

                <div className=''>
                    <h1 className='relative mb-3 text-2xl font-black before:absolute before:top-[30px] before:h-[3px] before:w-[98px] before:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-l'>Our Mission</h1>
                    <p className='mt-1 text-[15px] lg:mt-3'>Our mission at NoteHive is to revolutionize the way students learn by fostering a collaborative environment where knowledge is freely shared and accessible to all. We aim to empower students to achieve academic success through the collective power of shared notes and resources. By connecting learners from around the world, we strive to create a supportive community that enhances educational outcomes and promotes a culture of continuous learning and mutual support.</p>
                </div>
            </div>

        </div>

    )
}

export default About