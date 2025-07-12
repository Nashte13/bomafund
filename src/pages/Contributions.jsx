import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from '../components/GroupSidebar';
import './Contributions.css';

function Contributions({ user }) {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                setGroup(response.data.group);
            } catch (error) {
                console.error('Error fetching group:', error);
            }
        };
        fetchGroup();
    }, [groupId]);

    const getTotalContributions = () => {
        if (!group || !group.contributions) return 0;
        return group.contributions.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    };

    const getWithdrawnAmount = () => {
        if (!group || !group.withdrawals) return 0;
        return group.withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
    };

    return (
        <div className='contributions-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>BomaFund Contributions</h1>

            <div className='summary-section'>
                <p><strong>Total Contributions:</strong> KES {getTotalContributions()}</p>
                <p><strong>Total Withdrawn:</strong> KES {getWithdrawnAmount()}</p>
            </div>

            <div className='contribution-list'>
                <h2>Monthly Contributions</h2>
                {group?.members?.length ? (
                    <table className='contribution-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Month</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.members.map((member, index) => {
                                const memberContributions = (group.contributions || []).filter(
                                    c => c.phoneNumber === member.phoneNumber
                                );
                                return memberContributions.length ? (
                                    memberContributions.map((entry, idx) => (
                                        <tr key={`${index}-${idx}`}>
                                            <td>{member.name}</td>
                                            <td>{member.phoneNumber}</td>
                                            <td>{entry.month}</td>
                                            <td>KES {entry.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={index}>
                                        <td>{member.name}</td>
                                        <td>{member.phoneNumber}</td>
                                        <td colSpan="2" style={{ color: 'gray' }}>Not contributed yet</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No member data available.</p>
                )}
            </div>

            {user?.id === group?.leaderId ? (
                <button className='update-button' onClick={() => navigate(`/group/${groupId}/update-contributions`)}>
                    Update Contributions
                </button>
            ) : (
                <p className='view-only-note'>Only the group creator can update contributions.</p>
            )}
        </div>
    );
}

export default Contributions;
