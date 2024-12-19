import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './contexts/AppContext';
import AppNavbar from './components/AppNavbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateSeminar from './pages/Seminar/CreateSeminar';
import SeminarDetails from './pages/Seminar/SeminarDetails';
import EditSeminar from './pages/Seminar/EditSeminar';
import EditProfile from './pages/User/EditProfile';
import ChangePassword from './pages/User/ChangePassword';
import ViewUsers from './pages/User/ViewUsers';
import EditUser from './pages/User/EditUser';
import ForgotPassword from './pages/ForgotPassword';
import AccountRecoveryURL from './components/AccountRecoveryURL';
import ViewBookedSeminars from './pages/Seminar/ViewBookedSeminars';
import Layout from './layouts/Layout';
import Analytics from './components/Analytics';

function App() {
  const { isLoggedIn, data } =  useAppContext();

  return (
    <Router>
      {/* {isLoggedIn && <AppNavbar user={data} />} */}
      <Routes>
        <Route path="/reset_password/:token" element={<AccountRecoveryURL />} />
        
        {/* Redirect to /dashboard if logged in, otherwise redirect to login page */}
        <Route path="/sign_in" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Redirect to /dashboard if logged in, otherwise redirect to registration page */}
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Redirect to /dashboard if logged in, otherwise redirect to registration page */}
        <Route path="/forgot_password" element={isLoggedIn ? <Navigate to="/dashboard" /> : <ForgotPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={isLoggedIn 
          ? <Layout> <Dashboard user={data} /> </Layout> 
          : <Navigate to="/sign_in" />} 
        />
        <Route path="/seminar/:id" element={isLoggedIn 
          ? <Layout> <SeminarDetails /> </Layout> 
          : <Navigate to="/sign_in" />} 
        />
        <Route path="/edit_profile" element={isLoggedIn 
          ? <Layout> <EditProfile /> </Layout> 
          : <Navigate to="/sign_in" />} 
        />
        <Route path="/change_password" element={isLoggedIn 
          ? <Layout> <ChangePassword /> </Layout> 
          : <Navigate to="/sign_in" />} 
        />
        <Route path="/bookings" element={isLoggedIn 
          ? <Layout> <ViewBookedSeminars /> </Layout> 
          : <Navigate to="/sign_in" />} 
        />

        {/* Protected route: only accessible if logged in and admin */}
        {isLoggedIn && data.role === 'admin' && (
          <>
            <Route path="/create_seminar" element={<Layout> <CreateSeminar /> </Layout>} />
            <Route path="/seminar/:id/edit" element={<Layout> <EditSeminar /> </Layout>} />
            <Route path="/view_users" element={<Layout> <ViewUsers /> </Layout>} />
            <Route path="/edit_user/:id" element={<Layout> <EditUser /> </Layout>} />
            <Route path="/view_analytics" element={<Layout> <Analytics /> </Layout>} />
          </>
        )}

        {/* Fallback to home for undefined routes */}
        <Route path="*" element={<Navigate to="/sign_in" />} />
      </Routes>
    </Router>
  )
}

export default App
