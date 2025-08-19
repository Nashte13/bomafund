import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './dashboard.css';
import { useNavigate, Link } from 'react-router-dom';

const getGreeting = () => {
    const hour = new Date().getHours();
     if (hour < 12) return "Good morning";
     if (hour > 12) return "Good afternoon";
     return "Good evening";
};

const getEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour > 12) return '⛅';
    return '🌙';
};



function Dashboard({user}) {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        //fetch user's groups
        if (!user) return;
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${user.id}/groups`);
                setGroups(response.data.groups);
                localStorage.setItem('groups', JSON.stringify(response.data.groups));
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, [user]);

    return (
        <div className='dashboard-container'>
            <h1>
                {getGreeting()} {user.fullName} {getEmoji()}
            </h1>

            <nav className='dashboard-nav'>
                <Link to="/dashboard">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/faq">FAQ</Link>
                <Link to="/notifications">Notifications</Link>
                <Link to="/profile" className="profile-link">
                Profile
                <img src="/default-avatar.png" alt="Profile" className="nav-profile-pic" />
                </Link>
            </nav>

            <div className='dashboard-content'>
                <div>
                    <h2>Your groups</h2>
                    {groups.length === 0? (
                        <p>You are not part of any group yet.</p>
                    ) : (
                        groups.map((group) => (
                            <div key={group.id} className='group-overview'>
                                <h3>{group.name}</h3>
                                <button onClick={() => navigate(`/group/${group.id}`)}>View Group</button>

                            </div>
                        ))
                    )}
                </div>

                <div className='create-group'>
                    <h2>Create a New Group</h2>
                    <button onClick={() => navigate('/create-group')}>+ New Group</button>
                </div>


                
            </div>
        </div>

    );
}

export default Dashboard;