import {fetchPlayersForMatch, postPlayer} from '../models/playerModel.js';

const addPlayer = async (req, res) => {
  try {
    const player = await postPlayer(req.body);
    res.status(201).json({ message: 'player added', player });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getPlayersForMatch = async (req, res) => {
  try {
    const { match_id } = req.params;
    const players = await fetchPlayersForMatch(match_id);
    res.status(200).json(players);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { addPlayer, getPlayersForMatch };
