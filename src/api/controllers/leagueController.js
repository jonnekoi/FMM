import {
  postLeague,
  fetchUserLeagues,
  postUserToLeague, getLeagueByCode, isUserInLeague,
} from '../models/leagueModel.js';

const addLeague = async (req, res) => {
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
      maxPlayers: req.body.maxPlayers
    };

    if (req.body.isPublic !== 1) {
      data.leagueKey = req.body.leagueKey;
    }
    const response = await postLeague(data);
    console.log(response);
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

export {addLeague, getUserLeagues, addUserToLeague};
