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

const fetchTeamStats = async (matchId) => {
  try {
    const matchQuery = `
      SELECT home_team, away_team
      FROM matches
      WHERE id = ?
    `;
    const [matchRows] = await promisePool.query(matchQuery, [matchId]);
    const { home_team, away_team } = matchRows[0];

    const statsQuery = `
      SELECT
        t.id AS team_id,
        t.team_name,
        SUM(CASE WHEN m.home_team = t.id THEN m.home_score ELSE 0 END) + SUM(CASE WHEN m.away_team = t.id THEN m.away_score ELSE 0 END) AS goals_scored,
        SUM(CASE WHEN m.home_team = t.id THEN m.away_score ELSE 0 END) + SUM(CASE WHEN m.away_team = t.id THEN m.home_score ELSE 0 END) AS goals_conceded,
        SUM(CASE WHEN (m.home_team = t.id AND m.home_score > m.away_score) OR (m.away_team = t.id AND m.away_score > m.home_score) THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN (m.home_team = t.id AND m.home_score < m.away_score) OR (m.away_team = t.id AND m.away_score < m.home_score) THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN m.home_score = m.away_score THEN 1 ELSE 0 END) AS ties
      FROM matches m
      JOIN teams t ON t.id IN (m.home_team, m.away_team)
      WHERE t.id IN (?, ?)
      GROUP BY t.id, t.team_name
    `;
    const [statsRows] = await promisePool.query(statsQuery, [home_team, away_team]);

    const sortedStats = statsRows.sort((a, b) => {
      if (a.team_id === home_team) return -1;
      if (b.team_id === home_team) return 1;
      return 0;
    });

    return sortedStats;
  } catch (error) {
    console.log(error);
  }
}

const postResult = async (matchId, data) => {
  try {
    const { home_score, away_score } = data;
    const updateSql = `UPDATE matches SET home_score = ?, away_score = ? WHERE id = ?`;
    const updateParams = [home_score, away_score, matchId];
    await promisePool.execute(updateSql, updateParams);

    const guessesQuery = `SELECT user_id, home_score_guess, away_score_guess FROM matchguesses WHERE match_id = ?`;
    const [guesses] = await promisePool.query(guessesQuery, [matchId]);

    for (const guess of guesses) {
      const guessedHomeScore = Number(guess.home_score_guess);
      const guessedAwayScore = Number(guess.away_score_guess);
      const actualHomeScore = Number(home_score);
      const actualAwayScore = Number(away_score);
      let points = 0;
      if (actualHomeScore === guessedHomeScore && actualAwayScore === guessedAwayScore) {
        points = 5;
      }
      else if (
          (actualHomeScore > actualAwayScore && guessedHomeScore > guessedAwayScore) ||
          (actualHomeScore < actualAwayScore && guessedHomeScore < guessedAwayScore) ||
          (actualHomeScore === actualAwayScore && guessedHomeScore === guessedAwayScore)
      ) {
        points = 3;
      }


      if (points > 0) {
        const checkQuery = `SELECT COUNT(*) AS count FROM points WHERE user_id = ?`;
        const [rows] = await promisePool.query(checkQuery, [guess.user_id]);

        if (rows[0].count > 0) {
          const updateQuery = `UPDATE points SET points = points + ? WHERE user_id = ?`;
          await promisePool.execute(updateQuery, [points, guess.user_id]);
        } else {
          const insertQuery = `INSERT INTO points (user_id, points) VALUES (?, ?)`;
          await promisePool.execute(insertQuery, [guess.user_id, points]);
        }
      }
    }

    return { message: 'Score and points updated successfully' };
  } catch (error) {
    console.log(error);
  }
}

export { fetchMatches, postMatch, fetchMatch, postGuess, fetchUserGuess, fetchTeamStats, postResult };
