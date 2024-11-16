import {fetchMatches, postMatch, fetchMatch, postGuess, fetchUserGuess} from '../models/matchModel.js';

const getMatches = async (req, res) => {
  try {
    const matches = await fetchMatches();
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};

const addMatch = async (req, res) => {
  try {
    const data = {
      matchday: req.body.matchday,
      home_team: req.body.home_team,
      away_team: req.body.away_team,
    };
    const response = await postMatch(data);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding match:', error);
    res.status(500).json({ message: 'Failed to add match' });
  }
}

const getSingleMatch = async (req, res) => {
  try {
    const match = await fetchMatch(req.params.id);
    res.status(200).json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ message: 'Failed to fetch match' });
  }
}

const addGuess = async (req, res) => {
  try {
    const data = {
      match_id: req.params.id,
      user_id: res.locals.user.id,
      guess: req.body.guess,
    };

    const matchStarted = await fetchMatch(req.params.id);
    const matchtime = matchStarted.matchday;
    const currentTime = new Date();
    if (currentTime > matchtime) {
      res.status(403).json({ message: 'Match has already started' });
      return;
    }

    const response = await postGuess(data);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error adding guess:', error);
    res.status(500).json({ message: 'Failed to add guess' });
  }
}

const getUserGuess = async (req, res) => {
  try {
    const guess = await fetchUserGuess(req.params.id, req.params.userId);
    res.status(200).json(guess);
  } catch (error) {
    console.error('Error fetching guess:', error);
    res.status(500).json({ message: 'Failed to fetch guess' });
  }
}

export { getMatches, addMatch, getSingleMatch, addGuess, getUserGuess };
