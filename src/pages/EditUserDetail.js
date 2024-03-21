const UserDetail = () => {

    return (

                <div>
                    <h1>testing edit user detail page</h1>
                </div>
            );
}
export default UserDetail;


// import React, { useEffect, useState } from "react";
// import { useUsersContext } from "../hooks/useUserContext";
// import { useAuthContext } from "../hooks/useAuthContext";

// import '../index.css';
// // import "../styles/UserDetails.css";
// import UserEditModal from '../components/UserEditModal';
// // import defaultAvatar from '../default_pic.jpg';

// const UserDetail = () => {
//     const { user } = useAuthContext();
//     console.log(user);
//     const [userData, setUserData] = useState(null);

//     const username = user.username;
//     console.log("username test: " + username);

//     // const { userdetail } = {
//     //     username: "alindval",
//     //     id: "1234",
//     // }
//     async function getUserByUsername() {
//         try {
//             const response = await fetch(`/api/v1/userdetails/${username}`);
//             if (!response.ok) {
//                 throw new Error('User not found');
//             }
//             const userData = await response.json();
//             setUserData(userData);
//         } catch (error) {
//             console.log('failed to fetch user', error);
//         }

//     }
//     useEffect(() => {
//         if (username) {
//             getUserByUsername();
//         }
//     }, [username]);


//     console.log(user);
//     // console.log("id test "+ user._id);//undefined

//     return (

//         <div>
//             {userData&&<UserEditModal selecteduser={userData} />}
//         </div>
//     );
// }


// export default UserDetail;



// //old attempt

// // import React, { useEffect, useState } from "react";
// // import "../styles/UserDetails.css";

// // import { useAuthContext } from "../hooks/useAuthContext";

// // const EditUser = ({ closeModal }) => {
// //     const { user } = useAuthContext();
// //     const [formData, setFormData] = useState({ ...user }); 
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchUserData = async () => {
// //           try {
// //             const response = await fetch(`/api/v1/userdetails/${user._id}`, {
// //                 method: "PATCH",
// //                 headers: {
// //                   "Content-Type": "application/json",
// //                   Authorization: `Bearer ${user.token}`,
// //                 },
// //                 body: JSON.stringify(formData),
// //               });
// //             if (!response.ok) {
// //               throw new Error("Failed to fetch user data.");
// //             }
// //             const userData = await response.json();
// //             setFormData(userData); 
// //           } catch (error) {
// //             setError(error.message);
// //           }
// //         };
    
// //         if (user && user.token) {
// //           fetchUserData();
// //         }
// //       }, [formData, user]);
    
// //       const handleFormChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
// //       };
    
// //       const handleSaveChanges = async () => {
// //         try {
// //           const response = await fetch(`/api/v1/userdetails/${user._id}`, {
// //             method: "PATCH",
// //             headers: {
// //               "Content-Type": "application/json",
// //               Authorization: `Bearer ${user.token}`,
// //             },
// //             body: JSON.stringify(formData),
// //           });
    
// //           if (!response.ok) {
// //             const result = await response.json();
// //             throw new Error(result.message || "Update failed.");
// //           }
    
// //           closeModal();
// //         } catch (error) {
// //           setError(error.message);
// //         }
// //       };
    
// //       return (
// //         <div className="modal">
// //           <div className="modal-popup">
// //             <div className="modal-content">
// //               <span
// //                 className="material-symbols-outlined close-button"
// //                 onClick={closeModal}
// //               >
// //                 &#10005;
// //               </span>
    
// //               <h4>Edit Your Details</h4>
// //               {error && <p className="error">{error}</p>}

// //               <label>First Name:</label>
// //               <input
// //                 type="text"
// //                 name="first_name"
// //                 value={formData.first_name}
// //                 onChange={handleFormChange}
// //               />
        
// //               <button type="button" onClick={handleSaveChanges}>
// //                 Save Changes
// //               </button>
// //               <button type="button" onClick={closeModal}>
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       );
// //     };
    
// //     export default EditUser;