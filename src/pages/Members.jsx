import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GroupSidebar from '../components/GroupSidebar';
import './Members.css'

function Members() {
    const {groupId} = useParams;
    const [members, setMembers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/members`);
                setMembers(response.data.members);
            } catch (error) {
                console.error('Error fetching groups: ', error);
            }
        };

        fetchMembers();
    }, [groupId]);

    return (
        <div className='members-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>Group Members</h1>
            {members.length === 0 ? (
                <p>No members found.</p>
            ) : (
                <ul className='member-list'>
                    {members.map((member, index) => (
                        <li key={index} className='member-item'>
                            <strong>{member.name}</strong><br />
                            <span>{member.phoneNumber}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export default Members;