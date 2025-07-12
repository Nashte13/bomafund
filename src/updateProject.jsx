import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from './components/GroupSidebar';
import './updateProject.css';

function UpdateProject({ user }) {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [project, setProject] = useState({ name: '', number: '', budget: '' });

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                setGroup(res.data.group);
                if (res.data.group?.project) setProject(res.data.group.project);
            } catch (err) {
                console.error('Failed to load group:', err);
            }
        };
        fetchGroup();
    }, [groupId]);

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/project`, project);
            alert('Project updated successfully.');
            navigate(`/group/${groupId}/projects`);
        } catch (err) {
            console.error('Project update failed:', err);
            alert('Failed to update project.');
        }
    };

    if (!group || user?.id !== group?.leaderId) {
        return <div className='update-project-container'><p>You are not authorized to update the project.</p></div>;
    }

    return (
        <div className='update-project-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>Update Project</h1>

            <input
                type='text'
                placeholder='Project Name'
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
            <input
                type='text'
                placeholder='Project Number'
                value={project.number}
                onChange={(e) => setProject({ ...project, number: e.target.value })}
            />
            <input
                type='number'
                placeholder='Proposed Budget (KES)'
                value={project.budget}
                onChange={(e) => setProject({ ...project, budget: e.target.value })}
            />
            <button className='submit-button' onClick={handleSubmit}>Save Project</button>
        </div>
    );
}

export default UpdateProject;
