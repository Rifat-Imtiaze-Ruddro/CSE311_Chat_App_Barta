import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, User, Lock, Mail, Calendar, Phone as PhoneIcon, LogOut } from "lucide-react"

// Authentication Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base URL for your PHP backend
  const API_BASE = 'http://localhost:81/barta/api'; // Adjust this to your actual project folder name

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('chatUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('chatUser', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    f_name: '',
    l_name: '',
    mobile_no: '',
    dob: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.message);
      }
    } else {
      // Validation for registration
      if (!formData.username || !formData.password || !formData.email || !formData.f_name) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      const result = await register(formData);
      if (result.success) {
        setIsLogin(true);
        setFormData({ ...formData, password: '', email: '', f_name: '', l_name: '', mobile_no: '', dob: '' });
        setError('Registration successful! Please login.');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">💬</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Sign in to continue chatting' : 'Join our chat community'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="f_name"
                    placeholder="First Name"
                    value={formData.f_name}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="l_name"
                    placeholder="Last Name"
                    value={formData.l_name}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile_no"
                    placeholder="Mobile Number (optional)"
                    value={formData.mobile_no}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6 font-medium disabled:bg-gray-400"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                username: '',
                password: '',
                email: '',
                f_name: '',
                l_name: '',
                mobile_no: '',
                dob: '',
              });
            }}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Chat Component
const Chats = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user: currentUser, logout, API_BASE } = useAuth();

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
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold">💬</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Chat App</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Welcome, {currentUser.f_name || currentUser.username}!
          </span>
          <button
            onClick={logout}
            className="flex items-center text-red-600 hover:text-red-800 text-sm"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
      </div>

      <div className='flex flex-row flex-1'>
        {/* Users List Section */}
        <section className='w-1/3 border-r border-gray-200'>
          <div className='flex flex-col h-full'>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Contacts</h2>
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
                          {user.f_name} {user.l_name}
                        </h3>
                        <span className="text-xs text-gray-500">{user.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                      <p className="text-sm text-gray-400 truncate">{user.lastMessage}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section className='flex-1 flex flex-col'>
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
    </div>
  );
};

// Main App Component
const ChatApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Chats /> : <LoginForm />;
};

// Export the complete app with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <ChatApp />
    </AuthProvider>
  );
};

export default App;