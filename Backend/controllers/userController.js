import { activeUsers } from '../index.js';

export const getOnlineUsers = (req, res) => {
  const onlineUsers = Object.keys(activeUsers).map(id => {
    const user = activeUsers[id];
    return {
      _id: id,
      name: user.name,
      location: user.location,
    };
  });
  res.json(onlineUsers);
};