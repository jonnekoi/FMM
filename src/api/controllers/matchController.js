import {fetchMatches} from '../models/matchModel.js';

const getMatches = async (req, res) => {
  try {
    const matches = await fetchMatches();
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};

export { getMatches };
