import promisePool from '../../utils/database.js';

const postLeague = async (data) => {
  const check = await promisePool.query('SELECT * FROM leagues WHERE name = ?', [data.name]);
  if (check[0].length > 0) {
    return { status: 409, message: 'Name already exists' };
  }
  if (data.isPublic === 1) {
    const checkKey = await promisePool.query('SELECT * FROM leagues WHERE leagueKey = ?', [data.leagueKey]);
    if (checkKey[0].length > 0) {
      return { status: 409, message: 'Key already exists' };
    }
  }

  const userMaxLeagues = await promisePool.query('SELECT * FROM leagues WHERE owner = ?', [data.owner]);
  if (userMaxLeagues[0].length >= 30) { // Kuinka monta leagueta henkilöllä voi olla
    return { status: 409, message: 'MAX REACHED' };
  }

  try {
    const { name, isPublic, owner, maxPlayers, desci, StartDate, EndDate } = data;
    const leagueKey = data.isPublic === 1 ? null : data.leagueKey;
    const sql = `INSERT INTO leagues (name, isPublic, owner, maxPlayers, leagueKey, desci, StartDate, EndDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, isPublic, owner, maxPlayers, leagueKey, desci, StartDate, EndDate];
    const [result] = await promisePool.execute(sql, params);
    const leagueId = result.insertId;
    const userLeagueSql = `INSERT INTO userleagues (user_id, league_id) VALUES (?, ?)`;
    const userLeagueParams = [owner, leagueId];
    await promisePool.execute(userLeagueSql, userLeagueParams);
    return {status: 201, id: leagueId };
  } catch (error) {
    console.log(error);
  }
}

const fetchUserLeagues = async (user) => {
  try {
    const sql = `SELECT leagues.id, leagues.name, leagues.desci, users.username AS owner_username, leagues.maxPlayers 
                        FROM leagues
                        JOIN userLeagues ON leagues.id = userLeagues.league_id
                        JOIN users ON leagues.owner = users.id
                        WHERE userLeagues.user_id = ?;`;
    const [result] = await promisePool.execute(sql, [user]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

const fetchPublicLeagues = async (userId) => {
  try {
    const sql = `SELECT leagues.id, leagues.name, leagues.desci, users.username AS owner_username, leagues.maxPlayers
                 FROM leagues
                 JOIN users ON leagues.owner = users.id
                 LEFT JOIN userleagues ON leagues.id = userleagues.league_id AND userleagues.user_id = ?
                 WHERE leagues.isPublic = 1 AND userleagues.user_id IS NULL;`;
    const [result] = await promisePool.execute(sql, [userId]);
    return result;
  } catch (error) {
    console.log(error);
  }
}

const postUserToLeague = async (data) => {
  try {
    const sql = `INSERT INTO userleagues (user_id, league_id) VALUES (?, ?)`;
    const params = [data.user_id, data.league_id.id];
    await promisePool.execute(sql, params);
    return { message: "User added" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const postUserToPublicLeague = async (data) => {
    try {
        const sql = `INSERT INTO userleagues (user_id, league_id) VALUES (?, ?)`;
        const params = [data.user_id, data.league_id];
        await promisePool.execute(sql, params);
        return { message: "User added" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const isUserInLeague = async (user_id, league_id) => {
  try {
    const sql = `SELECT * FROM userleagues WHERE user_id = ? AND league_id = ?`;
    const [result] = await promisePool.execute(sql, [user_id, league_id]);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const getLeagueByCode = async (code) => {
  try {
    const sql = `SELECT id FROM leagues WHERE leagueKey = ?`;
    const [result] = await promisePool.execute(sql, [code]);
    return result[0];
  } catch (error) {
    console.log(error);
  }
}

const fetchLeagueData = async (leagueId) => {
  try {
    const sql = `SELECT leagues.name, leagues.isPublic, owner.username AS owner_username, leagues.maxPlayers, leagues.desci, leagues.StartDate, leagues.EndDate,
                    JSON_ARRAYAGG(JSON_OBJECT('id', users.id, 'name', users.username, 'points', IFNULL(points.points, 0))) AS league_users,
                    (SELECT JSON_ARRAYAGG(JSON_OBJECT('match_id', matches.id, 'matchday', matches.matchday, 'home_team', home_team.team_name, 'away_team', away_team.team_name, 'home_score', matches.home_score, 'away_score', matches.away_score))
                     FROM matches
                     LEFT JOIN teams AS home_team ON matches.home_team = home_team.id
                     LEFT JOIN teams AS away_team ON matches.away_team = away_team.id
                     WHERE matches.matchday > leagues.StartDate) AS league_matches
                     FROM leagues
                     JOIN users AS owner ON leagues.owner = owner.id
                     JOIN userleagues ON leagues.id = userleagues.league_id
                     JOIN users ON userleagues.user_id = users.id
                     LEFT JOIN points ON users.id = points.user_id AND leagues.id = points.league_id
                     WHERE leagues.id = ?
                     GROUP BY leagues.id, owner.username`;
    const [result] = await promisePool.execute(sql, [leagueId]);
    return result[0];
  } catch (error) {
    console.log(error);
  }

}


export {postLeague, fetchUserLeagues, postUserToLeague, getLeagueByCode, isUserInLeague, fetchPublicLeagues, postUserToPublicLeague, fetchLeagueData};

