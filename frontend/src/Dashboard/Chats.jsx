import React, { useState, useEffect, useRef } from 'react'
import { MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send } from "lucide-react"

const Chats = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({ username: 'roar' }); // This should come from login context
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Base URL for your PHP backend
  const API_BASE = 'http://localhost:81/barta/api'; // Adjust this to your actual project folder name

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/users.php`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Filter out current user and format data
        const filteredUsers = data
          .filter(user => user.username !== currentUser.username)
          .map(user => ({
            id: user.id || user.username,
            username: user.username,
            f_name: user.f_name || 'User',
            l_name: user.l_name || '',
            lastMessage: "Click to start chatting",
            time: "",
            photoURL: user.profile_pic || `https://ui-avatars.com/api/?name=${user.f_name || 'User'}+${user.l_name || ''}&background=random`,
            online: Math.random() > 0.5, // Random online status - you'd want to implement real presence
            unread: 0,
            email: user.email
          }));
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch messages between current user and selected user
  const fetchMessages = async (targetUser) => {
    if (!targetUser) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/chat/get_message.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1: currentUser.username,
          user2: targetUser.username
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.id || Math.random(),
          text: msg.content,
          type: msg.sender_id === currentUser.username ? 'sent' : 'received',
          time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }),
          sender_id: msg.sender_id,
          timestamp: msg.timestamp
        }));
        
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      content: newMessage.trim(),
      sender_id: currentUser.username,
      receiver_id: selectedUser.username,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
      const response = await fetch(`${API_BASE}/chat/send_message.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Add message to local state immediately for better UX
        const newMsg = {
          id: Date.now(),
          text: messageData.content,
          type: 'sent',
          time: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }),
          sender_id: currentUser.username,
          timestamp: messageData.timestamp
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update last message in users list
        setUsers(prev => prev.map(user => 
          user.username === selectedUser.username 
            ? { ...user, lastMessage: messageData.content, time: newMsg.time }
            : user
        ));
      } else {
        alert('Failed to send message: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchMessages(user);
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    `${user.f_name} ${user.l_name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='flex flex-row h-screen'>
      {/* Users List Section */}
      <section className='flex-1 border-r border-gray-200'>
        <div className='flex flex-col h-full'>
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Chats</h1>
            <input
              type="text"
              name='search'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">No users found.</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedUser?.username === user.username ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={user.photoURL} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${user.f_name}+${user.l_name}&background=random`;
                        }}
                      />
                    </div>
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.f_name} {user.l_name} (@{user.username})
                      </h3>
                      <span className="text-xs text-gray-500">{user.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className='flex-1 hidden lg:flex flex-col'>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={selectedUser.photoURL} 
                    alt={selectedUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h2 className="font-medium">{selectedUser.f_name} {selectedUser.l_name}</h2>
                  <p className="text-sm text-green-600">@{selectedUser.username}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex justify-center">
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm max-w-md text-center">
                        No messages yet. Start the conversation!
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id}>
                        {message.type === "received" && (
                          <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs lg:max-w-md">
                              <p className="text-gray-800">{message.text}</p>
                              <span className="text-xs text-gray-500 mt-1 block">{message.time}</span>
                            </div>
                          </div>
                        )}

                        {message.type === "sent" && (
                          <div className="flex justify-end">
                            <div className="bg-blue-500 text-white p-3 rounded-lg shadow-sm max-w-xs lg:max-w-md">
                              <p>{message.text}</p>
                              <span className="text-xs text-blue-100 mt-1 block">{message.time}</span>
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

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                  <Smile className="h-5 w-5 text-gray-500" />
                </button>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-medium mb-2">Select a chat</h2>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Chats;