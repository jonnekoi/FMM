import {
  postLeague,
  fetchUserLeagues,
  postUserToLeague, getLeagueByCode, isUserInLeague, fetchPublicLeagues, postUserToPublicLeague, fetchLeagueData, postLeagueName, fetchLeagueNames
} from '../models/leagueModel.js';

const addLeague = async (req, res) => {
  const startDate = new Date();
  const duration = parseInt(req.body.duration, 10);
  const allowedDurations = [7, 30, 60, 120, 365];

  if (!allowedDurations.includes(duration)) {
    return res.status(400).json({ message: 'Invalid duration' });
  }

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);

  if (req.body.isPublic === 'true') {
    req.body.isPublic = 1;
  } else {
    req.body.isPublic = 0;
  }

  try {
    const data = {
      name: req.body.name,
      isPublic: req.body.isPublic,
      owner: res.locals.user.id,
      maxPlayers: req.body.maxPlayers,
      desci: req.body.desci,
      StartDate: startDate,
      EndDate: endDate,
      baseLeague: req.body.baseLeague
    };

    if (req.body.isPublic !== 1) {
      data.leagueKey = req.body.leagueKey;
    }
    const response = await postLeague(data);
    if (response.status === 409) {
      return res.status(409).json({ message: 'Name or key already exist' });
    } else if (response.status === 201) {
      return res.status(201).json(response);
    }
  } catch (error) {
    console.error('Error adding league:', error);
    res.status(500).json({ message: 'Failed to add league' });
  }
}


const getUserLeagues = async (req, res) => {
  try {
    const user = res.locals.user.id;
    const leagues = await fetchUserLeagues(user);
    res.status(200).json(leagues);
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    res.status(500).json({ message: 'Failed to fetch user leagues' });
  }
}

const addUserToLeague = async (req, res) => {
  const league = await getLeagueByCode(req.params.code);
  try {
    const existingUser = await isUserInLeague(res.locals.user.id, league.id);
    if (existingUser.length > 0) {
      const message = 'User is already in the league';
      console.log(message);
      return res.status(409).json({ message });
    }

    const data = {
      user_id: res.locals.user.id,
      league_id: league
    };
    const response = await postUserToLeague(data);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding user to league:', error);
    res.status(400).json({ message: error.message });
  }
}

const addUserToPublicLeague = async (req, res) => {
  try {
    const leagueId = req.params.id;
    const userId = res.locals.user.id;

    const existingUser = await isUserInLeague(userId, leagueId);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'User is already in the league' });
    }

    const data = {
      user_id: userId,
      league_id: leagueId
    };
    console.log("meneekö tähän?");
    const response = await postUserToPublicLeague(data);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding user to public league:', error);
    res.status(400).json({ message: error.message });
  }
}


const getPublicLeagues = async (req, res) => {
  try {
    const leagues = await fetchPublicLeagues(res.locals.user.id);
    res.status(200).json(leagues);
  } catch (error) {
    console.error('Error fetching public leagues:', error);
    res.status(500).json({ message: 'Failed to fetch public leagues' });
  }
}

const getLeagueData = async (req, res) => {
  try {
    const league = await fetchLeagueData(req.params.id);
    league.league_users = JSON.parse(league.league_users);
    league.league_matches = JSON.parse(league.league_matches);
    res.status(200).json(league);
  } catch (error) {
    console.error('Error fetching league data:', error);
    res.status(500).json({ message: 'Failed to fetch league data' });
  }
}

const addLeagueName = async (req, res) => {
  try {
    const data = {
      name: req.body.leaguename,
    };
    const response = await postLeagueName(data);
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error adding leaguename' });
  }
}

const getAllLeagueNames = async (req, res) => {
  try {
    const leagues = await fetchLeagueNames();
    res.status(200).send(leagues);
  } catch (error) {
    console.error("error fetching leaguenames", error);
    res.status(500).send({ message: 'Error fetching leaguenames'});
  }
}

export {addLeague, getUserLeagues, addUserToLeague, getPublicLeagues, addUserToPublicLeague, getLeagueData, addLeagueName, getAllLeagueNames};
