import React from 'react';
import Products from './Products';


const Category = () => {
  return (
    <div className='pt-20 bg-slate-700'>
      <div className="text-xl mb-14 md:text-2xl font-medium text-center bg-blend-normal">
        Originally this page was Home page but then category page was trasnformed to Home page, and vice versa
      </div>

        <Products />
    </div>
  )
}

export default Category;
