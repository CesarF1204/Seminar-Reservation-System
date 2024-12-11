import React from 'react';
import Seminar from '../components/Seminar';
import LogOutButton from '../components/LogOutButton';
import Profile from '../components/Profile';

const Dashboard = ({ user }) => {
    return (
        <div className="text-center mt-4">
            {/* User Profile */}
            <Profile user={user} />

            {/* Logout Button */}
            <LogOutButton />

            {/* View All Seminar */}
            <Seminar />
        </div>
    );
}

export default Dashboard
