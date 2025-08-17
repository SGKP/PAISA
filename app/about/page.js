import React from 'react'

const about = () => {
  return (
    <>
    <div>
        {/* about page on get me a chai using next js and tailwind give me */}
      <h1 className='text-white font-bold text-5xl py-14 container mx-auto text-center'>
        About Get Me A Chai
      </h1>
        <div className='text-white py-14 container mx-auto text-center'>
            <p className='text-lg'>
            Get Me A Chai is a crowd funding platform where fans can support their favorite influencers by buying them a chai.
            It allows influencers to connect with their audience and receive financial support directly from their fans.
            </p>
        </div>
        <div className='text-white py-14 container mx-auto text-center'>
            <h2 className='text-2xl font-bold mb-4'>Our Mission</h2>
            <p className='text-lg'>
            Our mission is to empower influencers by providing them with a platform to receive support from their fans.
            We believe that every influencer deserves to be supported by their community.
            </p>
        </div>
        <div className='text-white py-14 container mx-auto text-center'>
            <h2 className='text-2xl font-bold mb-4'>Our Vision</h2>
            <p className='text-lg'>
            Our vision is to create a world where influencers can thrive by receiving the support they need from their fans.
            We aim to build a community of supporters who are passionate about helping their favorite creators succeed.
            </p>
        </div>
    </div>
     <div className='text-white py-14 container mx-auto text-center'>
        <h2 className='text-2xl font-bold mb-4'>Our Values</h2>
        <p className='text-lg'>
        We value transparency, community, and support. We believe in creating a platform where influencers can connect with their fans in a meaningful way.
        </p>
    </div>
    <div className='text-white py-14 container mx-auto text-center'>
        <h2 className='text-2xl font-bold mb-4'>Get Involved</h2>
        <p className='text-lg'>
        If you're an influencer looking to connect with your fans and receive support, Get Me A Chai is the perfect platform for you.
        Sign up today and start your journey towards building a stronger relationship with your audience.
        </p>
    </div>

    </>
  )
}

export default about

export const metadata = {
  title:"About - Get Me A Chai"
}

