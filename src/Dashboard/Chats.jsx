import React from 'react'

const Chats = () => {
  return (
    <div className='flex flex-row'>
      <section className='flex-1'>
        <h1 className="text-5xl font-bold">Chats</h1>
         <input
 type="text"  name='search' 


           
            placeholder="Search by name..."
            className="input input-bordered w-[70%] text-black"
           
          />
      </section>
      <section className='flex-1 hidden lg:block'>
        <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Welcome to Barta</h1>
      <p className="py-6">
        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.
      </p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
      </section>
    </div>
  )
}

export default Chats
