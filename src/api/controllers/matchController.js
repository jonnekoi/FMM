import {fetchMatches, postMatch} from '../models/matchModel.js';

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

export { getMatches, addMatch };
