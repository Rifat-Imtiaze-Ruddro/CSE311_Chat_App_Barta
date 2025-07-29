import React, { useState } from 'react'
import {MoreVertical, Phone, Video, Smile, Paperclip, Mic } from "lucide-react"

const Chats = () => {
  const [search, setSearch] = useState('');
   const chatting = [
  {
    id: 1,
    username: "claire_92",
    lastMessage: "Haha oh man",
    time: "08:21 pm",
    photoURL: "https://i.ibb.co/M5p61wQZ/azwedo-l-lc-Fh-MYB8g-ar4-unsplash.jpg",
    online: false,
    unread: 0,
  },
  {
    id: 2,
    username: "joe.cool",
    lastMessage: "Haha that's terrifying 😂",
    time: "07:30 pm",
    photoURL: "/placeholder.svg?height=40&width=40&text=J",
    online: false,
    unread: 0,
  },
  {
    id: 3,
    username: "optimus_prime",
    lastMessage: "My name is Optimus prime so",
    time: "11:49",
    photoURL: "/placeholder.svg?height=40&width=40&text=O",
    online: true,
    unread: 0,
  },
  {
    id: 4,
    username: "progate_rw_dev",
    lastMessage: "~Rwabusaza: This is amazing...",
    time: "07:04",
    photoURL: "/placeholder.svg?height=40&width=40&text=P",
    online: true,
    unread: 0,
  },
  {
    id: 5,
    username: "yves_szn",
    lastMessage: "Bro, that's so sick",
    time: "06:58",
    photoURL: "/placeholder.svg?height=40&width=40&text=Y",
    online: true,
    unread: 0,
  },
  {
    id: 6,
    username: "mucyo.dev",
    lastMessage: "The new update is live 🔥",
    time: "01:00",
    photoURL: "/placeholder.svg?height=40&width=40&text=M",
    online: true,
    unread: 0,
  },
  {
    id: 7,
    username: "joy_22",
    lastMessage: "Haha that's terrifying 😂",
    time: "01:00",
    photoURL: "/placeholder.svg?height=40&width=40&text=J",
    online: false,
    unread: 0,
  },
  {
    id: 8,
    username: "elvin_404",
    lastMessage: "",
    time: "01:00",
    photoURL: "/placeholder.svg?height=40&width=40&text=E",
    online: false,
    unread: 0,
  },
];

  const messages = [
    {
      id: 1,
      text: "Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Click to learn more.",
      type: "system",
      time: "",
    },
    {
      id: 2,
      text: "Hey brother, are you still a fan of UI design? Can I show you something?",
      type: "received",
      time: "17:07",
    },
    {
      id: 3,
      text: "Hey Regis, absolutely 👍",
      type: "sent",
      time: "17:08",
    },
    {
      id: 4,
      text: "Checkout this cool project am working on 😊",
      type: "received",
      time: "17:10",
     
    },
    {
      id: 5,
      text: "Looks awesome 👍👍",
      type: "sent",
      time: "17:12",
    },
  ]


  const chats=chatting.filter((u)=>
    u.username.toLowerCase().includes(search.toLowerCase())
  

  )
  return (
    <div className='flex flex-row'>
      <section className='flex-1 '>
        <div className='flex flex-col  gap-3'>
          <h1 className="text-5xl font-bold pl-3">Chats</h1>
         <input
 type="text"  name='search' 


           value={search}
           onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search by name..."
            className="input input-bordered w-[70%] text-black pl-3"
           
          />

            <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
          <p>No members found.</p>
        ) :(chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
            >
              <div className="relative">
             <div className="avatar">
  <div className="ring-primary ring-offset-base-100 w-12 rounded-full  ring-offset-2">
    <img src={chat.photoURL} />
  </div>
</div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">{chat.username}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          )))}
        </div>
        </div>
      </section>
      <section className='flex-1 hidden lg:block'>
        <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
           <div className="avatar">
  <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-offset-2">
    <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
  </div>
</div>
            <div className="ml-3">
              <h2 className="font-medium">Regis</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
           
              <Phone className="h-5 w-5" />
              
           
           
              <Video className="h-5 w-5" />
           
           
              <MoreVertical className="h-5 w-5" />
           
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="chat-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23e5e7eb" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23chat-bg)"/></svg>\')',
          }}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "system" && (
                  <div className="flex justify-center">
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm max-w-md text-center">
                      {message.text}
                    </div>
                  </div>
                )}

                {message.type === "received" && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                      
                      <p className="text-gray-800">{message.text}</p>
                      <span className="text-xs text-gray-500 mt-1 block">{message.time}</span>
                    </div>
                  </div>
                )}

                {message.type === "sent" && (
                  <div className="flex justify-end">
                    <div className="bg-green-500 text-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p>{message.text}</p>
                      <span className="text-xs text-green-100 mt-1 block">{message.time}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
           
              <Smile className="h-5 w-5 text-gray-500" />
           
           
              <Paperclip className="h-5 w-5 text-gray-500" />
           
            <div className="flex-1 relative">
               <input
 type="text"  name='search' 


          
            placeholder="Type here..."
            className="input input-bordered w-[70%] text-black pl-3"
           
          />
            </div>
           
              <Mic className="h-5 w-5 text-gray-500" />
           
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}

export default Chats
