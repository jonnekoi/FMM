import promisePool from '../../utils/database.js';

const fetchMatches = async () => {
  try {
    const [rows] = await promisePool.query(`SELECT id, matchday, home_team, away_team, home_score, away_score FROM matches`);
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

const fetchMatch = async (id) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM matches WHERE id = ?`, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching match:', error);
  }
}

const postGuess = async (guessData) => {
  try {
    const { user_id, match_id, guess } = guessData;
    const [existingRows] = await promisePool.query(
        `SELECT * FROM matchguesses WHERE user_id = ? AND match_id = ?`,
        [user_id, match_id]
    );

    if (existingRows.length > 0) {
      const updateSql = `UPDATE matchguesses SET guess = ? WHERE user_id = ? AND match_id = ?`;
      const updateParams = [guess, user_id, match_id];
      await promisePool.execute(updateSql, updateParams);
      return { message: 'Guess updated successfully' };
    } else {

      const insertSql = `INSERT INTO matchguesses (user_id, match_id, guess) VALUES (?, ?, ?)`;
      const insertParams = [user_id, match_id, guess];
      const [result] = await promisePool.execute(insertSql, insertParams);
      return { guess_id: result.insertId };
    }
  } catch (error) {
    console.log(error);
  }
}

const fetchUserGuess = async (matchId, userId) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM matchguesses WHERE match_id = ? AND user_id = ?`, [matchId, userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching user guess:', error);
  }

}

export { fetchMatches, postMatch, fetchMatch, postGuess, fetchUserGuess };
