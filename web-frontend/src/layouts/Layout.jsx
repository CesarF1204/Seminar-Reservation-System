import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import AppNavbar from '../components/AppNavbar';
import Footer from '../components/Footer';

const Layout = ( {children} ) => {

    const { data } =  useAppContext();

    return (
        <div className='flex flex-col min-h-screen'>
            <AppNavbar user={data} />
            <div className='container mx-auto flex-1'>
                { children }
            </div>
            <Footer />
        </div>
    )
}

export default Layout