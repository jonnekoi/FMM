import {fetchMatches, postMatch, fetchMatch, postGuess, fetchUserGuess, fetchTeamStats, postResult} from '../models/matchModel.js';

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
      inLeague: req.body.league_name,
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
      match_id: req.body.match_id,
      user_id: res.locals.user.id,
      home_score_guess: req.body.home_score,
      away_score_guess: req.body.away_score,
      scorer: req.body.scorer,
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
    const userId = res.locals.user.id;
    const guess = await fetchUserGuess(req.params.id, userId);
    res.status(200).json(guess);
  } catch (error) {
    console.error('Error fetching guess:', error);
    res.status(500).json({ message: 'Failed to fetch guess' });
  }
}

const getTeamStats = async (req, res) => {
  try {
    const matchId = req.params.id;
    const stats = await fetchTeamStats(matchId);
    res.status(200).json(stats);
  } catch(error){
    console.log("Error getting stats", error);
    res.status(500)({message: "Failed to fetch team stats"})
  }
}

const addResult = async (req, res) => {
  try {
    const matchId = req.params.id;
    const data = {
      home_score: req.body.home_score,
      away_score: req.body.away_score
    }
    await postResult(matchId, data);
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500)({message: "error adding result"});
  }
}

export { getMatches, addMatch, getSingleMatch, addGuess, getUserGuess, getTeamStats, addResult };
