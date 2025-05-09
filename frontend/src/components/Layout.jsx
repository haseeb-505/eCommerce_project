import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='bg-slate-700 text-white min-h-screen flex flex-col'>
      <NavBar />
      
      <main className="flex-grow">
        <Outlet />  {/* This renders the current route's component */}
      </main>
      
      <Footer />
    </div>
  );
};


export default Layout;