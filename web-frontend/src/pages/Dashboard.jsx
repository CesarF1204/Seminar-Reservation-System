import React from 'react';
import { useLocation } from 'react-router-dom';
import Seminar from '../components/Seminar/Seminar';
import Profile from '../components/User/Profile';

const Dashboard = ({ user }) => {
    const location = useLocation();
    const { newProfileDetails } = location.state || {}; 

    return (
        <div className="text-center mt-4">
            {/* User Profile */}
            <Profile user={user} newProfileDetails={newProfileDetails} />

            {/* View All Seminar */}
            <Seminar />
        </div>
    );
}

export default Dashboard
