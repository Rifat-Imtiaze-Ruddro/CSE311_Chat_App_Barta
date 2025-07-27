import React from 'react'
import { Link } from 'react-router'

const NotFound = () => {
  return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-error">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="mt-2 text-base-content">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound