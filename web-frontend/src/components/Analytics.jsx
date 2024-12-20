import React, { useRef } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../contexts/AppContext';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import html2canvas from 'html2canvas';
import { convertDateFormat } from '../helpers/globalHelpers';

/* Register the required components for Chart.js */
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const dashboardRef = useRef(null);
    /* Get the data.token from the authenticated user */
    const { data } = useAppContext();

    /* Default Query Params */
    const queryParams = {
        page: 1,
        limit: 0,
        sortKey: '_id',
        sortDirection: 'asc',
        search: ''
    }

    /* Desctructure needed data */
    const { page, limit, sortKey, sortDirection, search } = queryParams;

    /* Query to get all users data */
    const { data: users_data = {} } = useQuery(
        "fetchUsers",
        () => apiClient.fetchUsers(data.token, { page, limit, sortKey, sortDirection, search }),
        {
            suspense: true,
            refetchOnWindowFocus: false,
            retry: 1,
            keepPreviousData: true,
        }
    );

    /* Compute and get registered accounts total, admins total, and users total */
    const accounts_data = users_data.users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {accounts: users_data.totalCount, admin: 0, user: 0 });

    /* Query to get all seminars data */
    const { data: seminars_data = [] } = useQuery(
        "getSeminars",
        () => apiClient.getSeminars(data.token, { page, limit, sortKey, sortDirection, search }),
        {
            suspense: true,
            refetchOnWindowFocus: false,
            retry: 1,
            keepPreviousData: true,
        }
    );

    /* Compute and get seminars count, expired seminars count, and available seminars count */
    const seminar_data = seminars_data.seminars.reduce((acc, seminar) => {
        if (new Date(seminar.date) < new Date()) {
            acc.expired++;
        } else {
            acc.available++;
        }
        return acc;
    }, { seminars_count: seminars_data.totalCount, expired: 0, available: 0 });

    /* Query to get all booked seminars data */
    const { data: bookings = [] } = useQuery(
        "fetchAllBookings",
        () => apiClient.fetchAllBookings(data.token),
        {
            suspense: true,
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    /* Compute the total number of bookings and count them based on their payment status (pending, confirmed, and rejected) */
    const booking_data = bookings.reduce((acc, booked_seminar) => {
        acc[booked_seminar.paymentStatus] = (acc[booked_seminar.paymentStatus] || 0) + 1;
        return acc;
    }, { bookings: bookings.length, pending: 0, confirmed: 0, rejected: 0 });

    const sales = bookings.reduce((totals, booking) => {
        if (booking.paymentStatus === 'pending') {
            totals.pending += booking.seminar.fee || 0;
        } else if (booking.paymentStatus === 'confirmed') {
            totals.confirmed += booking.seminar.fee || 0;
        }
        totals.total = totals.pending + totals.confirmed;
        return totals;
    }, { pending: 0, confirmed: 0, total: 0 });

    /* Pie chart for accounts */
    const accountsChartData = {
        labels: [`Admin(${accounts_data.admin})`, `User(${accounts_data.user})`],
        datasets: [{
            data: [accounts_data.admin, accounts_data.user],
            backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        }]
    };

    /* Pie chart for seminar status */
    const seminarsChartData = {
        labels: [`Available(${seminar_data.available})`, `Expired(${seminar_data.expired})`],
        datasets: [{
            data: [seminar_data.available, seminar_data.expired],
            backgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(200, 0, 55, 1)'],
        }]
    };

    /* Pie chart for booking status */
    const bookingsChartData = {
        labels: [`Pending(${booking_data.pending})`, `Confirmed(${booking_data.confirmed})`, `Rejected(${booking_data.rejected})`],
        datasets: [{
            data: [booking_data.pending, booking_data.confirmed, booking_data.rejected],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(200, 0, 55, 1)'],
        }]
    };

    /* Bar chart for sales */
    const salesChartData = {
        labels: ['Pending', 'Confirmed', 'Total'],
        datasets: [{
            label: 'Sales (₱)',
            data: [sales.pending, sales.confirmed, sales.total],
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
        }]
    };

    /* This function handles the exporting of the content of the analytics page as a PNG image */
    const handleExportAll = async () => {
        /* Get the reference to the dashboard element */
        const element = dashboardRef.current;
        /* Get the export button element */
        const exportButton = document.querySelector('#export-btn');
        /* This will hide the export button to the exported image */
        exportButton.style.display = 'none';

        /* Check if the element to export exists */
        if (element) {
            /* Use html2canvas to capture the content of the element as a canvas image */
            const canvas = await html2canvas(element, {
                backgroundColor: '#fff', /* Set the background color to white */
                useCORS: true, /* Enable CORS for external resources */
                scale: 2, /* Set the scale to 2 for higher resolution (1,2,3) */
            });

            /* Get todays date */
            const todayDate = convertDateFormat(Date.now());
            /* Use regex to convert slash to dash */
            const today = todayDate.replace(/\//g, "-");
            
            /* Show the export button after done exporting */
            exportButton.style.display = 'block';
            /* Create an anchor link to download the image */
            const link = document.createElement('a');
            /* Set the download link to the generated image data */
            link.href = canvas.toDataURL('image/png');
            /* Set the filename for the image download */
            link.download = `Seminar_Analytics_${today}.png`;
            /* Trigger the download by simulating a click on the link */
            link.click();
        }
    };

    return (
        <div className="p-4 space-y-8" ref={dashboardRef}>
            <h2 className="text-2xl font-semibold text-center">Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Accounts Pie Chart */}
                <div className="bg-white py-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-center">Accounts</h3>
                    <p className="text-sm text-center">Total: {accounts_data.accounts}</p>
                    <Pie data={accountsChartData} className="w-full h-64 sm:h-48 mx-auto" />
                </div>
                {/* Seminars Pie Chart */}
                <div className="bg-white py-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-center">Seminars</h3>
                    <p className="text-sm text-center">Total: {seminar_data.seminars_count}</p>
                    <Pie data={seminarsChartData} className="w-full h-64 sm:h-48 mx-auto" />
                </div>
                {/* Bookings Pie Chart */}
                <div className="bg-white py-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-center">Bookings</h3>
                    <p className="text-sm text-center">Total: {booking_data.bookings}</p>
                    <Pie data={bookingsChartData} className="w-full h-64 sm:h-48 mx-auto" />
                </div>
            </div>
            {/* Sales Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-center">Sales</h3>
                <Bar 
                    data={{
                        labels: ['Pending Sales', 'Confirmed Sales'],
                        datasets: [
                            {
                                label: 'Sales Amount',
                                data: [sales.pending, sales.confirmed,],
                                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: `Total Sales: ₱${sales.total} (Pending: ₱${sales.pending} + Confirmed: ₱${sales.confirmed})`,
                            },
                        },
                    }} 
                    className="w-full h-64 sm:h-48 mx-auto" 
                />
            </div>
            <div className="flex justify-center">
                <button id="export-btn" onClick={handleExportAll} className="p-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition mb-4">Export Analytics</button>
            </div>
        </div>
    );
};

export default Analytics;
