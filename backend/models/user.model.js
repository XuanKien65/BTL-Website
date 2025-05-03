const pool = require("../config/db.config");

const User = {
  findAll: async () => {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  },

  findById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE userid = $1", [
      id,
    ]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0];
  },

  findByUsername: async (username) => {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    return rows[0];
  },

  create: async (user) => {
    const defaultAvatarURL = "http://localhost:5501/uploads/user-default.jpg";
    const { rows } = await pool.query(
      `INSERT INTO users 
       (username, email, passwordhash, role, avatarurl) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user.username,
        user.email,
        user.password,
        user.role || "user",
        user.avatarURL || defaultAvatarURL,
      ]
    );
    return rows[0];
  },

  update: async (id, user) => {
    const { rows } = await pool.query(
      `UPDATE users SET 
       username = $1, 
       email = $2, 
       role = $3, 
       status = $4, 
       avatarurl = $5 
       WHERE userid = $6
       RETURNING *`,
      [user.username, user.email, user.role, user.status, user.avatarURL, id]
    );
    return rows[0];
  },

  updateAva: async (id, avaUrl) => {
    const { rowCount } = await pool.query(
      "UPDATE users SET avatarurl = $1 WHERE userid = $2",
      [avaUrl, id]
    );
    return rowCount > 0;
  },
  updatePassword: async (id, newPassword) => {
    const { rowCount } = await pool.query(
      "UPDATE users SET passwordhash = $1 WHERE userid = $2",
      [newPassword, id]
    );
    return rowCount > 0;
  },

  delete: async (id) => {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE userid = $1",
      [id]
    );
    return rowCount > 0;
  },
  saveResetToken: async (userId, token, expiry) => {
    const { rowCount } = await pool.query(
      `UPDATE users 
       SET resetpasswordtoken = $1, resetpasswordexpiry = $2 
       WHERE userid = $3`,
      [token, expiry, userId]
    );
    return rowCount > 0;
  },
  findByResetToken: async (token) => {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE resetpasswordtoken = $1",
      [token]
    );
    return rows[0];
  },
};

module.exports = User;
