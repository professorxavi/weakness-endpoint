const pokeRoutes = require('./poke-routes');

module.exports = (app, pokedex) => {
  pokeRoutes(app, pokedex);
};
