// "use client"
import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
        <footer className="bg-gray-800 text-white flex justify-center   px-4 h-16 items-center">
            <p className='text-center'> Copyright &copy; {currentYear} Get me a chai-Fund-All Right reserved  </p>
        </footer>
     </div>
  )
}

export default Footer


