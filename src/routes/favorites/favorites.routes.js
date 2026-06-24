import express from 'express';
import setPokemonFavorite from './setPokemonFavorite.js';
import getPokemonFavorite from './getPokemonFavorite.js';
import getFavoritesByUser from './getFavoritesByUser.js';

const router = express.Router();

router.get('/', getFavoritesByUser);
router.get('/pokemons', getPokemonFavorite);
router.post('/', setPokemonFavorite);


export default router;