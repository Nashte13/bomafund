import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from '../components/GroupSidebar';
import './projects.css';

function Projects({ user }) {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [group, setGroup] = useState(null);
    const [project, setProject] = useState({ name: '', number: '', budget: '' });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                setGroup(res.data.group);
                if (res.data.group.project) setProject(res.data.group.project);
                if (res.data.group.comments) setComments(res.data.group.comments);
            } catch (err) {
                console.error('Error fetching project data:', err);
            }
        };
        fetchGroup();
    }, [groupId]);

    const handleSubmitProject = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/project`, project);
            alert('Project posted successfully.');
        } catch (error) {
            console.error('Error posting project:', error);
            alert('Failed to post project.');
        }
    };

    const handleAddComment = async () => {
        if (!newComment) return;
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/comments`, {
                userId: user.id,
                text: newComment,
            });
            setComments(prev => [...prev, { userId: user.id, text: newComment }]);
            setNewComment('');
        } catch (err) {
            console.error('Error posting comment:', err);
        }
    };

    return (
        <div className='projects-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>Group Project</h1>

            {user?.id === group?.leaderId && (
                <div className='project-form'>
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
                    <button onClick={handleSubmitProject}>Submit Project</button>
                    <button 
                        onClick={() => navigate(`/group/${groupId}/update-project`)}
                        className='edit-project=btn'
                        >
                        Edit Project
                    </button>
                </div>
            )}

            {project.name && (
                <div className='project-details'>
                    <h2>{project.name}</h2>
                    <p><strong>Project No.:</strong> {project.number}</p>
                    <p><strong>Proposed Budget:</strong> KES {project.budget}</p>
                </div>
            )}

            <div className='comments-section'>
                <h3>Member Feedback</h3>
                <ul>
                    {comments.map((c, i) => (
                        <li key={i}>{c.text}</li>
                    ))}
                </ul>
                <textarea
                    placeholder='Share your view...'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button onClick={handleAddComment}>Post Comment</button>
            </div>
        </div>
    );
}

export default Projects;
