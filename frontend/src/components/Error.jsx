import React from 'react'

const Error = ({ errorMessage }) => {
  return (
    <div className='py-20 px-20  bg-slate-700 text-white'>
      <h1>{errorMessage}</h1>
    </div>
  )
}

export default Error
