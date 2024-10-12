import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the custom CSS

const API_URL = 'http://localhost:5000';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [claimHistory, setClaimHistory] = useState([]);

  // Fetch users, leaderboard, and history when component mounts
  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
    fetchHistory();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    setUsers(response.data);
  };

  const fetchLeaderboard = async () => {
    const response = await axios.get(`${API_URL}/leaderboard`);
    setLeaderboard(response.data);
  };

  const fetchHistory = async () => {
    const response = await axios.get(`${API_URL}/history`);
    setClaimHistory(response.data);
  };

  const handleClaimPoints = async () => {
    if (selectedUser) {
      await axios.post(`${API_URL}/claim-points`, { userId: selectedUser });
      fetchLeaderboard();  // Fetch updated leaderboard
      fetchHistory();  // Fetch updated claim history
    }
  };

  const handleAddUser = async () => {
    if (newUserName) {
      await axios.post(`${API_URL}/users`, { name: newUserName });
      fetchUsers();  // Fetch updated users list
      setNewUserName('');  // Clear input field
    }
  };

  return (
    <div className="container">
      <h1>Leaderboard</h1>

      {/* Add New User */}
      <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
        <input
          type="text"
          placeholder="Add new user"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>

      {/* User Selection and Claim Points */}
      <div className="grid">
        <div className="card">
          <h2>Select User</h2>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="user-select"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <button onClick={handleClaimPoints} disabled={!selectedUser}>
            Claim Points
          </button>
        </div>

        {/* Leaderboard */}
        <div className="card">
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Claim History */}
        <div className="card">
          <h2>Claim History</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Points Claimed</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {claimHistory.map((history) => (
                <tr key={history._id}>
                  <td>{history.userId.name}</td>
                  <td>{history.pointsClaimed}</td>
                  <td>{new Date(history.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
