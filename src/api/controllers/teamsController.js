import {fetchTeams, postTeam} from '../models/teamsModel.js';

const getAllTeams = async (req, res) => {
  try {
    const teams = await fetchTeams();
    res.status(200).send(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).send({ message: 'Error fetching teams' });
  }
}

const addTeam = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
    };
    const response = await postTeam(data);
    res.status(201).send(response);
  } catch (error) {
    console.error('Error adding team:', error);
    res.status(500).send({ message: 'Error adding team' });
  }
}

export { getAllTeams, addTeam };
