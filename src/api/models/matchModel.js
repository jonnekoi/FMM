import promisePool from '../../utils/database.js';

const fetchMatches = async () => {
  try {
    const [rows] = await promisePool.query(`SELECT id, match_id, matchday, home_team, away_team, home_score, away_score FROM matches`);
    return rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
  }
}

export { fetchMatches };
