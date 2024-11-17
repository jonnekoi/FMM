import promisePool from '../../utils/database.js';
const postPlayer = async (player) => {
  try {
    const { name, team_id } = player;
    const sql = `INSERT INTO players (name, team_id) VALUES (?, ?)`;
    const params = [name, team_id];
    const [result] = await promisePool.execute(sql, params);
    return { id: result.insertId };
  } catch (error) {
    console.log(error);
  }
}

const fetchPlayersForMatch = async (match_id) => {
  try {
    const sql = `
      SELECT players.* 
      FROM players 
      JOIN matches ON players.team_id = matches.home_team OR players.team_id = matches.away_team
      WHERE matches.id = ?
    `;
    const [rows] = await promisePool.query(sql, [match_id]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { postPlayer, fetchPlayersForMatch };
