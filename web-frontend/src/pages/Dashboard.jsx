import React from 'react';
import Seminar from '../components/Seminar';
import LogOutButton from '../components/LogOutButton';

const Dashboard = ({ user }) => {
    return (
        <div className="text-center mt-5">
            <h1>Welcome {user.firstName}!</h1>
            <LogOutButton />

            {/* View All Seminar */}
            <Seminar />
        </div>
    );
}

export default Dashboard
