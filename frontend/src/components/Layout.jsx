import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='bg-slate-900 text-white'>
      <NavBar />
      <Outlet />  {/* This renders the current route's component */}
      <Footer />
    </div>
  );
};

export default Layout;