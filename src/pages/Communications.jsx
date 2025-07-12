import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GroupSidebar from '../components/GroupSidebar';
import './communications.css';

function Communications({ user }) {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
                setGroup(res.data.group);
                if (res.data.group.messages) setMessages(res.data.group.messages);
            } catch (err) {
                console.error('Error loading group:', err);
            }
        };
        fetchGroup();
    }, [groupId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!text && !media) return;

        const messageData = {
            senderId: user.id,
            content: text,
            mediaUrl: '',
            mediaType: '',
        };

        if (media) {
            const type = media.type.startsWith('image') ? 'image' : 'video';
            messageData.mediaType = type;
            messageData.mediaUrl = URL.createObjectURL(media); // Mock preview
        }

        try {
            setMessages(prev => [...prev, messageData]);
            setText('');
            setMedia(null);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    return (
        <div className='communications-container'>
            <button className='menu-button' onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

            <h1>{group?.name || 'Group'} Chats</h1>

            <div className='chat-box'>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.senderId === user.id ? 'mine' : 'theirs'}`}>
                        {msg.content && <p>{msg.content}</p>}
                        {msg.mediaUrl && msg.mediaType === 'image' && (
                            <img src={msg.mediaUrl} alt='chat-img' className='chat-media' />
                        )}
                        {msg.mediaUrl && msg.mediaType === 'video' && (
                            <video src={msg.mediaUrl} controls className='chat-media'></video>
                        )}
                    </div>
                ))}
                <div ref={scrollRef}></div>
            </div>

            <div className='chat-input-section'>
                <input
                    type='text'
                    placeholder='Type your message...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <input
                    type='file'
                    accept='image/*,video/*'
                    onChange={(e) => setMedia(e.target.files[0])}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default Communications;
