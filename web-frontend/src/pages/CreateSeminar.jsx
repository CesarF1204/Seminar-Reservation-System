import React, { useState } from 'react';

const CreateSeminar = () => {
    const [createSeminar, setCreateSeminar] = useState({
        title: '',
        description: '',
        date: '',
        timeFrame: {
            from: '',
            to: ''
        },
        venue: '',
        speaker: {
            name: '',
            image: '',
            linkedin: ''
        },
        fee: 0,
        slotsAvailable: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setCreateSeminar((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value // Update the nested field
                }
            }));
        } else {
            setCreateSeminar((prev) => ({
                ...prev,
                [name]: value // Update top-level fields
            }));
        }
    };

    const handleCreateSeminar = async (e) => {
        e.preventDefault();

        const { title, description, date, timeFrame, venue, speaker, fee, slotsAvailable } = createSeminar;

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URI}/seminars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ title, description, date, timeFrame, venue, speaker, fee, slotsAvailable }),
            });

            if (!response.ok) {
                throw new Error('Creating seminar failed. Please try again.');
            }

            const data = await response.json();

            if (response.status === 201) {
                setCreateSeminar({
                    title: '',
                    description: '',
                    date: '',
                    timeFrame: {
                        from: '',
                        to: ''
                    },
                    venue: '',
                    speaker: {
                        name: '',
                        image: '',
                        linkedin: ''
                    },
                    fee: 0,
                    slotsAvailable: 0
                });
                
                alert(data.message);
            } else {
                console.error('Creating seminar failed:', data.error);
            }
        } catch (error) {
            console.error('Create seminar error:', error);
            // setErrorMessage(error.message);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Create New Seminar</h2>
            <form onSubmit={handleCreateSeminar} className="flex flex-col space-y-6 w-full max-w-xl mx-auto">
                {/* Title Field */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={createSeminar.title}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
    
                {/* Description Field */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={createSeminar.description}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                </div>
    
                {/* Date Field */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={createSeminar.date}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
    
                {/* TimeFrame Fields */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="from" className="block text-sm font-medium mb-2">From</label>
                        <input
                            type="time"
                            id="from"
                            name="timeFrame.from"
                            value={createSeminar.timeFrame.from}
                            onChange={handleInputChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="to" className="block text-sm font-medium mb-2">To</label>
                        <input
                            type="time"
                            id="to"
                            name="timeFrame.to"
                            value={createSeminar.timeFrame.to}
                            onChange={handleInputChange}
                            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
    
                {/* Venue Field */}
                <div>
                    <label htmlFor="venue" className="block text-sm font-medium mb-2">Venue</label>
                    <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={createSeminar.venue}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
    
                {/* Speaker Fields */}
                <div>
                    <label htmlFor="speakerName" className="block text-sm font-medium mb-2">Speaker Name</label>
                    <input
                        type="text"
                        id="speakerName"
                        name="speaker.name"
                        value={createSeminar.speaker.name}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
    
                <div>
                    <label htmlFor="speakerImage" className="block text-sm font-medium mb-2">Speaker Image URL</label>
                    <input
                        type="url"
                        id="speakerImage"
                        name="speaker.image"
                        value={createSeminar.speaker.image}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
    
                <div>
                    <label htmlFor="speakerLinkedIn" className="block text-sm font-medium mb-2">Speaker LinkedIn</label>
                    <input
                        type="url"
                        id="speakerLinkedIn"
                        name="speaker.linkedin"
                        value={createSeminar.speaker.linkedin}
                        onChange={handleInputChange}
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
    
                {/* Fee Field */}
                <div>
                    <label htmlFor="fee" className="block text-sm font-medium mb-2">Fee</label>
                    <input
                        type="number"
                        id="fee"
                        name="fee"
                        value={createSeminar.fee}
                        onChange={handleInputChange}
                        min="0"
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
    
                {/* Slots Available Field */}
                <div>
                    <label htmlFor="slotsAvailable" className="block text-sm font-medium mb-2">Slots Available</label>
                    <input
                        type="number"
                        id="slotsAvailable"
                        name="slotsAvailable"
                        value={createSeminar.slotsAvailable}
                        onChange={handleInputChange}
                        min="0"
                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
    
                <button type="submit" className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition mt-4">
                    Create Seminar
                </button>
            </form>
        </div>
    );
}

export default CreateSeminar
