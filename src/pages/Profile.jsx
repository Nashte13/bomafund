import React, {useEffect, useState} from 'react';
import './profile.css';
 
function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        (localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleSave = () => {
        //save changes to be implemented later
        setIsEditing(false);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    if (!user) {
        return <h2>loading user details...</h2>
    }

    return (
        <div className='profile-container'>
            <h1>Your Profile</h1>
            {/* Profile Picture Upload */}
            <div className="profile-pic-container">
                <img src={profilePic || "/default-avatar.png"} alt="Profile" className="profile-pic" />
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className='profile-form'>
                <div className='form-group'>
                    <label>Full Name</label>
                    {isEditing ? (
                        <input 
                            type='text'
                            value={user.fullName}
                            onChange={(e) => setUser({...user, fullName: e.target.value})}
                        />
                    ) : (
                        <p>{user.fullName}</p>
                    )}
                </div>

                <div className='form-group'>
                    <label>Full Email</label>
                    {isEditing ? (
                        <input 
                            type='text'
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                    ) : (
                        <p>{user.email}</p>
                    )}
                </div>

                <div className='form-group'>
                    <label>Phone Number</label>
                    {isEditing ? (
                        <input 
                            type='text'
                            value={user.phoneNumber}
                            onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                        />
                    ) : (
                        <p>{user.phoneNumber}</p>
                    )}
                </div>

                <div className='profile-actions'>
                    {isEditing ? (
                        <button onClick={handleSave}>Save Changes</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;

