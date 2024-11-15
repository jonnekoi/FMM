import promisePool from '../../utils/database.js';

const fetchMatches = async () => {
  try {
    const [rows] = await promisePool.query(`SELECT id, match_id, matchday, home_team, away_team, home_score, away_score FROM matches`);
    return rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
  }
}


const postMatch = async (match) => {
  try {
    const { matchday, home_team, away_team } = match;
    const sql = `INSERT INTO matches (matchday, home_team, away_team) VALUES (?, ?, ?)`;
    const params = [matchday, home_team, away_team];
    const [result] = await promisePool.execute(sql, params);
    return { id: result.insertId };
  } catch (error) {
    console.log(error);
  }
}

export { fetchMatches, postMatch };
