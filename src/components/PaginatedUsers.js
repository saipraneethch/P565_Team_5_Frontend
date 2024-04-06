import React from 'react'

const PaginatedUsers = ({users, loading}) => {
    if(loading){
        return <h2>Loading...</h2>
    }
  return (
    <div className="users-wrapper">
    <div className="users">

      {users &&
        users.map(user => (
          <li key={user._id}>
          user.userdetail
          </li>
        ))};
        </div>
        </div>

  )
}

export default PaginatedUsers