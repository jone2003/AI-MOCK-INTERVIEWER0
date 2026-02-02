"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

function Header() {
  const path = usePathname();
  const router = useRouter()
  useEffect(() => {
    console.log(path)
  }, [])
  function getRoutLink(path) {
    router.push(path)
  }


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo' />
      <ul className='hidden md:flex gap-6'>

        <li onClick={() => getRoutLink('/Dashboard')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path == '/Dashboard' && 'text-primary font-bold'}`}>Dashboard</li>

        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Questions</li>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Upgrade</li>
        <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>How it works?</li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Header