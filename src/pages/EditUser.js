import React, { useEffect, useState } from "react";
import "../styles/App.css";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

const EditUser = () => {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
    });

    const [error, setError] = useState(null); // For displaying error messages

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // console.log("controller test print ", user.username);
                const res = await fetch(
                    `/api/v1/userdetails/username/${user.username}`,
                    {
                        method: "GET",
                    });

                if (!res.ok) {
                    throw new Error("User details not found.");
                }
                const userdetail = await res.json();
                setFormData({
                    first_name: userdetail.first_name,
                    last_name: userdetail.last_name,
                    username: userdetail.username,
                });

            } catch (error) {
                setError(error.message);
            }
        };
        fetchUserDetails();
    }, [user.username]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };


    const handleSaveChanges = async () => {
        try {

            // Update user details
            const updateResponse = await fetch(`/api/v1/userdetails/${user._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(formData),
            });

            const updateResult = await updateResponse.json();

            if (!updateResponse.ok) {
                throw new Error(updateResult.message || "Update failed.");
            }
            toast.success("User updated successfully!");

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="edit-user">
            <div className="edit-user-container">
                <div className="edit-user-content">
                    <h4>Edit Profile Information</h4>
                    {error && <p className="error">{error}</p>}

                    {/* Form fields for user details */}
                    <label htmlFor="firstName">First Name: </label>
                    <input
                        id="firstName"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleFormChange}
                    />
                    <label htmlFor="lastName">Last Name: </label>
                    <input
                        id="lastName"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleFormChange}
                    />
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleFormChange}
                    />

                    {/* Image upload field */}
                    <label>Upload Image: </label>
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFormChange}
                    />

                    <button type="button" onClick={handleSaveChanges}>
                        Save
                    </button>

                </div>
            </div>
        </div>
    );
};

export default EditUser;