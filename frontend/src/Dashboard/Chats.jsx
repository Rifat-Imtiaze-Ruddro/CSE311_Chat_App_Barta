import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, X } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import defaultProfilePic from '../assets/defaultprofile.png';
import AttachmentPreview from './components/AttachmentPreview';

const Chats = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    users: true,
    messages: false
  });
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Error formatting timestamp:', timestamp, e);
      return 'Just now';
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'file',
      name: file.name,
      size: file.size
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    URL.revokeObjectURL(newAttachments[index].preview);
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedUser || !user || sending) return;

    setSending(true);
    const formData = new FormData();
    
    if (newMessage.trim()) {
      formData.append('content', newMessage.trim());
    }
    
    attachments.forEach((attachment, index) => {
      formData.append(`attachments[${index}]`, attachment.file);
    });
    
    formData.append('sender_id', user.username);
    formData.append('receiver_id', selectedUser.username);

    try {
      const res = await fetch('http://localhost/barta/api/send_message.php', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setNewMessage('');
      setAttachments([]);
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser || !user?.username) return;
    
    setLoading(prev => ({ ...prev, messages: true }));
    
    try {
      const res = await fetch('http://localhost/barta/api/get_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1: user.username,
          user2: selectedUser.username
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.messages.map(msg => ({
          ...msg,
          type: msg.sender_id === user.username ? 'sent' : 'received',
          time: formatTime(msg.timestamp),
          sender: {
            name: `${msg.f_name} ${msg.l_name}`,
            profile_pic: msg.profile_pic || defaultProfilePic
          },
          attachments: msg.attachments || []
        })));
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  useEffect(() => {
    if (user?.username) {
      setLoading(prev => ({ ...prev, users: true }));
      
      fetch(`http://localhost/barta/api/users.php?current_user=${user.username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsers(data.users.map(u => ({
              ...u,
              online: Math.random() > 0.5,
              profile_pic: u.profile_pic || defaultProfilePic
            })));
          }
          setLoading(prev => ({ ...prev, users: false }));
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          setLoading(prev => ({ ...prev, users: false }));
        });
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.f_name.toLowerCase().includes(search.toLowerCase()) ||
    u.l_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='flex flex-row h-[calc(100vh-64px)]'>
      {/* Left sidebar - Contacts list */}
      <section className='flex-1 border-r border-gray-200 overflow-hidden flex flex-col'>
        <div className='p-4 border-b border-gray-200'>
          <h1 className="text-2xl font-bold">Chats</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="input input-bordered w-full mt-3"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading.users ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {users.length === 0 ? 
                "No contacts available" : 
                "No contacts match your search"}
            </div>
          ) : (
            filteredUsers.map((contact) => (
              <div
                key={contact.username}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${selectedUser?.username === contact.username ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedUser(contact)}
              >
                <div className="relative">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={contact.profile_pic} 
                        alt={contact.username}
                      />
                    </div>
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.f_name} {contact.l_name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 truncate">@{contact.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Right section - Chat area */}
      <section className='flex-1 hidden lg:flex flex-col'>
        {selectedUser ? (
          <>
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={selectedUser.profile_pic} 
                      alt={selectedUser.username}
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <h2 className="font-medium">
                    {selectedUser.f_name} {selectedUser.l_name}
                  </h2>
                  <p className={`text-sm ${selectedUser.online ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedUser.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="btn btn-ghost btn-circle">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="btn btn-ghost btn-circle">
                  <Video className="h-5 w-5" />
                </button>
                <button className="btn btn-ghost btn-circle">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="chat-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23e5e7eb" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23chat-bg)"/></svg>\')',
              }}
            >
              {loading.messages ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={`${message.id}_${message.timestamp}`}>
                        {message.type === "received" ? (
                          <div className="flex justify-start">
                            <div className="flex items-end space-x-2 max-w-xs">
                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img 
                                    src={message.sender.profile_pic} 
                                    alt={message.sender.name}
                                  />
                                </div>
                              </div>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                {message.content && <p className="text-gray-800">{message.content}</p>}
                                {message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((attachment, idx) => (
                                      <AttachmentPreview 
                                        key={idx}
                                        attachment={attachment}
                                        type="received"
                                      />
                                    ))}
                                  </div>
                                )}
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {message.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <div className="bg-primary text-white p-3 rounded-lg shadow-sm max-w-xs">
                              {message.content && <p>{message.content}</p>}
                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment, idx) => (
                                    <AttachmentPreview 
                                      key={idx}
                                      attachment={attachment}
                                      type="sent"
                                    />
                                  ))}
                                </div>
                              )}
                              <span className="text-xs text-primary-content mt-1 block">
                                {message.time}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="bg-gray-50 p-4 border-t border-gray-200">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="relative">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {attachment.type === 'image' ? (
                          <img 
                            src={attachment.preview} 
                            alt="Preview" 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="p-2 text-center">
                            <Paperclip className="w-6 h-6 mx-auto text-gray-500" />
                            <p className="text-xs truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.size / 1024).toFixed(1)}KB
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="btn btn-ghost btn-circle"
                >
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="input input-bordered w-full"
                    disabled={sending}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-ghost btn-circle text-primary"
                  disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                >
                  {sending ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-2xl font-bold mb-2">Select a chat</h2>
              <p className="text-gray-500">
                Choose a contact from the list to start messaging or search for someone new.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Chats;