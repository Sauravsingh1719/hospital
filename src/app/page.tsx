import dbConnect from '@/utils/dbConnect'
import React from 'react'

const Page = () => {
  dbConnect()
  return (
    <div>
      Hello
    </div>
  )
}

export default Page