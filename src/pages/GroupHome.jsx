import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from '../components/GroupSidebar';
import './groupHome.css'

function GroupHome() {
    const {groupId} = useParams();
    console.log("Group ID received:", groupId);
    const [group, setGroup] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                console.log("Group data fetched:", response.data);
                setGroup(response.data.group);
            } catch (error) {
                console.error('Error fetching group details: ', error.response?.data || error.message);
            }
        };
        fetchGroup();
    }, [groupId]);


    return (
        <div className='group-home-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>🟰</button>

            {/*sidebar menu*/}
            <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                {/*Reusable sidebar*/}
                <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            </div>

            {/* Group Info Layout */}
            <div className='group-info-wrapper'>
                <div className='group-info-card'>
                    <img src={group?.profilePicture || '/default-group.png'} alt='Group logo' className='group-logo' />
                    <h1>{group ? `Welcome to ${group.name}` : 'Loading group...'}</h1>
                    <p className='group-description'>
                        <strong>Motto:</strong>{ group?.motto || 'No motto set' }
                    </p>
                    <p className='group-description'>
                        <strong>Mission:</strong>{ group?.mission || 'No mission set' }
                    </p>
                    <p className='group-members-count'>Members: {group?.members.length || 0}</p>
                </div>
            </div>
            
        </div>
    );
}

export default GroupHome;