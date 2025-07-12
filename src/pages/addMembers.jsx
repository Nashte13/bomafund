import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GroupSidebar from '../components/GroupSidebar';
import './addMembers.css';

function AddMembers() {
    const { groupId } = useParams();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleAddMember = async () => {
        if (!name || !phoneNumber) return alert("Enter the member's name and phone number.");

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members`, { name, phoneNumber });
            alert('Member added successfully');
            setName('');
            setPhoneNumber('');
        } catch (error) {
            console.error('Error adding member: ', error);
            alert('Failed to add member');
        }
    };

    return (
        <div className='add-members-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
                
            <h1>Add Members</h1>
            <input
                type='text'
                placeholder='Enter member name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type='text'
                placeholder='Enter member phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={handleAddMember}>Add Member</button>
        </div>
    );
}

export default AddMembers;
