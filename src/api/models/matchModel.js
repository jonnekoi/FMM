import promisePool from '../../utils/database.js';

const fetchMatches = async () => {
  try {
    const query = `
      SELECT 
        m.id, 
        m.matchday, 
        ht.team_name AS home_team, 
        at.team_name AS away_team, 
        m.home_score, 
        m.away_score
      FROM matches m
      JOIN teams ht ON m.home_team = ht.id
      JOIN teams at ON m.away_team = at.id
    `;
    const [rows] = await promisePool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
  }
};



const postMatch = async (match) => {
  try {
    const { matchday, home_team, away_team, inLeague } = match;
    const sql = `INSERT INTO matches (matchday, home_team, away_team, inLeague) VALUES (?, ?, ?, ?)`;
    const params = [matchday, home_team, away_team, inLeague];
    const [result] = await promisePool.execute(sql, params);
    return { id: result.insertId };
  } catch (error) {
    console.log(error);
  }
}

const fetchMatch = async (id) => {
  try {
    const query = `
      SELECT 
        m.id, 
        m.matchday, 
        ht.team_name AS home_team, 
        at.team_name AS away_team, 
        m.home_score, 
        m.away_score
      FROM matches m
      JOIN teams ht ON m.home_team = ht.id
      JOIN teams at ON m.away_team = at.id
      WHERE m.id = ?
    `;
    const [rows] = await promisePool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching match:', error);
  }
};


const postGuess = async (guessData) => {
  try {
    const { user_id, match_id, home_score_guess, away_score_guess, scorer } = guessData;
    const [existingRows] = await promisePool.query(
        `SELECT * FROM matchguesses WHERE user_id = ? AND match_id = ?`,
        [user_id, match_id]
    );

    if (existingRows.length > 0) {
      const updateSql = `UPDATE matchguesses SET home_score_guess = ?, away_score_guess = ?, scorer = ? WHERE user_id = ? AND match_id = ?`;
      const updateParams = [home_score_guess, away_score_guess, scorer, user_id, match_id];
      await promisePool.execute(updateSql, updateParams);
      return { message: 'Guess updated successfully' };
    } else {
      const insertSql = `INSERT INTO matchguesses (user_id, match_id, home_score_guess, away_score_guess, scorer) VALUES (?, ?, ?, ?, ?)`;
      const insertParams = [user_id, match_id, home_score_guess, away_score_guess, scorer];
      const [result] = await promisePool.execute(insertSql, insertParams);
      return { guess_id: result.insertId };
    }
  } catch (error) {
    console.log(error);
  }
}

const fetchUserGuess = async (matchId, userId) => {
  try {
    const query = `
        SELECT 
          mg.guess_id,
          mg.user_id,
          mg.match_id,
          mg.home_score_guess,
          mg.away_score_guess,
          p.name AS scorer
        FROM matchguesses mg
        JOIN players p ON mg.scorer = p.id
        WHERE mg.match_id = ? AND mg.user_id = ?`;
    const [rows] = await promisePool.query(query, [matchId, userId]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.error('Error fetching user guess:', error);
  }

}

export { fetchMatches, postMatch, fetchMatch, postGuess, fetchUserGuess };
