import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from '../components/GroupSidebar';
import './updateContributions.css';

function UpdateContributions({ user }) {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [contributions, setContributions] = useState([]);
    const [month, setMonth] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                setGroup(response.data.group);

                if (response.data.group?.members) {
                    const initialData = response.data.group.members.map(member => ({
                        name: member.name,
                        phoneNumber: member.phoneNumber,
                        amount: ''
                    }));
                    setContributions(initialData);
                }
            } catch (error) {
                console.error('Error fetching group:', error);
            }
        };
        fetchGroup();
    }, [groupId]);

    const handleInputChange = (index, value) => {
        const updated = [...contributions];
        updated[index].amount = value;
        setContributions(updated);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                month,
                entries: contributions,
            };
            await axios.post(`http://localhost:5000/api/groups/${groupId}/contributions`, payload);
            alert('Contributions updated successfully.');
            navigate(`/group/${groupId}/contributions`);
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to update contributions.');
        }
    };

    if (!group || user?.id !== group?.leaderId) {
        return <div className='update-contributions-container'><p>You are not authorized to update contributions.</p></div>;
    }

    return (
        <div className='update-contributions-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>Update Contributions</h1>

            <input
                type='text'
                placeholder='Enter month (e.g. June 2025)'
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className='month-input'
            />

            <div className='update-list'>
                {contributions.map((member, index) => (
                    <div key={index} className='member-entry'>
                        <label>{member.name} ({member.phoneNumber})</label>
                        <input
                            type='number'
                            value={member.amount}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder='KES'
                        />
                    </div>
                ))}
            </div>

            <button className='submit-button' onClick={handleSubmit}>Submit Contributions</button>
        </div>
    );
}

export default UpdateContributions;
