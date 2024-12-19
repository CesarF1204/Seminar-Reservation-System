# Seminar Reservation System

A comprehensive seminar reservation system with user authentication, seminar management, booking, and payment processing functionalities. The system allows users to securely register, browse seminars, book seminars, and make payments. Admins can manage seminars, users, and bookings.

## Features

### 1. Login and Register Authentication using JWT
- **Secure Login and Registration**: User authentication with JWT, including personal details such as first name, last name, email, and password.
- **Encrypted Password Storage**: Passwords are securely hashed and stored using bcrypt.
- **JWT Authentication**: Token-based authentication.
- **Frontend and Backend Validations**: Both frontend and backend validation to ensure secure and valid data input.

### 2. User Profile Management
- **View and Update Profile**: Users can view and update their personal profile details, including their name, email, and password.
- **Secure Password Update**: Users can securely update their password with proper validation and encryption.
- **Profile Picture Upload**: Users can upload a profile picture.
- **Account Soft Deletion**: Admin can disable user access by soft-deleting accounts (e.g., making accounts inactive).
- **Frontend and Backend Validations**: User input is validated on both frontend and backend.

### 3. Reset Password
- **Password Reset Request**: Users can request a password reset by providing their email.
- **Email Verification**: A reset password link is sent to the user's email.
- **Reset Password Functionality**: Users can reset their password securely after verifying via email.

### 4. Seminar Browsing
- **Seminar Listings**: Users can browse a list of seminars with details such as title, description, date, time, venue, speaker, fee, and available slots.
- **Search and Filter**: Seminars can be filtered by title, date, speaker, or price for easier discovery.
- **Admin Management**: Admins can create, edit, and delete seminars.
- **Frontend and Backend Validations**: Proper validations to ensure correct data handling.

### 5. Booking System
- **Seminar Booking**: Users can select a seminar from the list and book it by providing necessary payment details.
- **Proof of Payment**: Users can upload proof of payment (e.g., receipt or bank deposit slip).
- **Booking Status**: Track booking status (pending, confirmed, or rejected), with email notifications sent to the user.
  - **Pending**: Default status when a user books a seminar. The available slots will decrement by 1, and the "Book Now" button will be disabled until rejected.
  - **Confirmed**: Admin can change the status to confirmed once payment is validated and the booking is accepted.
  - **Rejected**: Admin can change the status to rejected. When rejected, the available slots will increment by 1, and the "Book Now" button will be re-enabled for the user.
  
### 6. Payment Processing
- **Stripe Integration**: Online payments are processed using Stripe for payment intent generation.
- **Offline Payment**: Users can opt for offline payment and upload proof of payment.

### 7. Notification System
- **Booking Notifications**: Users will receive email notifications regarding booking status changes (e.g., pending, confirmed, rejected).
- **Reminders**: Users will receive reminders about upcoming seminars through a notification bell when logged in.

### 8. Reporting:
- **Analytics**: Viewing of analytics for accounts, seminars, bookings, and sales. It can also be exported through an image.

## Technology Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT), bcrypt, crypto
- **Payment Integration**: Stripe API
- **Email Service**: NodeMailer for sending emails
- **Cloud Storage**: Cloudinary (for image uploading)
- **File Handling**: Multer (for file uploads)
- **Real-Time Communication**: Socket.IO (for real-time notifications/reminders)
- **Data Visualization**: Chart.js (for interactive charts and graphs)

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- Stripe Account (for payment processing)

## Steps to Run Locally
### 1. Clone this repository:
```
git clone https://github.com/CesarF1204/Seminar-Reservation-System.git
cd seminar-reservation-system
```
### 2. Set up the Backend:
```
cd web-backend
```
### 3. Create your own .env file and add your own keys in the following format:
```
PORT=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=

# Cloudinary Variables
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Nodemailer
EMAIL_USER=
EMAIL_PASS=

# Stripe
STRIPE_SECRET_KEY=
```
### 4. Install dependencies and start the server:
```
npm install
npm run dev
```
### 5. Set up the Frontend:
```
cd .. 
cd web-frontend
```
### 6. Create your own .env file and add your own keys in the following format:
```
VITE_API_BASE_URL=
VITE_STRIPE_PUB_KEY=
```
### 7. Install dependencies and start the development server:
```
npm install
npm run dev
```
### You may also test it at:
https://seminar-reservation-system.netlify.app/

Enjoy working with the Seminar Reservation System!
