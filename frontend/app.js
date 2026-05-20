import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>DevOps Project</h1>

      <h2>Users List</h2>

      {users.map((user) => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}

export default App;