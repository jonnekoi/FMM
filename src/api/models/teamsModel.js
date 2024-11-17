import promisePool from '../../utils/database.js';

const fetchTeams = async () => {
  const [rows] = await promisePool.query("SELECT * FROM teams");
  return rows;
}

const postTeam = async (data) => {
  const { name } = data;
  const sql = "INSERT INTO teams (team_name) VALUES (?)";
  const [result] = await promisePool.execute(sql, [name]);
  return { team_id: result.insertId };
}

export { fetchTeams, postTeam };
