import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import DeleteAccountModal from './DeleteAccountModal';

const UserAction = ({ user, refetch, setPage }) => {

    /* State for showing delete modal */
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <>
        <div className="flex space-x-4 items-center">
            <Link to={`/edit_user/${user._id}`} className="text-blue-400 hover:text-blue-600 inline-flex items-center">
                <FaEdit className="mr-1" /> Edit 
            </Link>
            <Link className="text-red-400 hover:text-red-600 inline-flex items-center" onClick={() => setShowDeleteModal(true)}>
                <FaTrashAlt className="mr-1" /> Delete 
            </Link>
        </div>
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteAccountModal setShowDeleteModal={setShowDeleteModal} user={user} refetch={refetch} setPage={setPage} />
            )}
        </>
    )
}

export default UserAction
