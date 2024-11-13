import promisePool from "../../utils/database.js";
import "dotenv/config";

const isUsernameAvailable = async (username) => {
  const [response] = await promisePool.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
  );
  return response.length === 0;
};

const addUser = async (user) => {
  try {
    const {name, username, password, access, email} = user;
    const sql = `INSERT INTO users (name, username, password, access, email) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, username, password, access, email];
    const [result] = await promisePool.execute(sql, params);
    return {user_id: result.insertId};
  } catch (error) {
    console.log(error);
  }
};

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT id, name, username, access, email FROM users");
  return rows;
};

const getUserByUsername = async (user) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  const [rows] = await promisePool.execute(sql, [user]);
  if (rows.length === 0) return false;
  return rows[0];
};

const updateUser = async (id, body, user) => {
  if (user.access !== "admin" && body.access) {
    return { message: "Only admins are allowed to change user access." };
  }

  let sql = promisePool.format("UPDATE users SET ? WHERE id = ?", [
    body,
    user.id,
  ]);

  if (user.access === "admin") {
    sql = promisePool.format("UPDATE users SET ? WHERE id = ?", [body, id]);
  }

  const rows = await promisePool.execute(sql);
  if (rows[0].affectedRows === 0) return false;
  return { message: "Success" };
};

const listAllPoints = async () => {
  const [rows] = await promisePool.query(`
    SELECT users.id AS user_id, users.username, points.points
    FROM users
    LEFT JOIN points ON users.id = points.user_id
  `);
  return rows;
};

export { listAllUsers, addUser, isUsernameAvailable, getUserByUsername, updateUser, listAllPoints };
