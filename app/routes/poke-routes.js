const combineWeaknesses = require('./combine-weaknesses');

module.exports = (app, pokedex) => {
  app.get('/poke', (req, res) => {
    pokedex.resource(['/api/v2/type/12','/api/v2/type/4'])
      .then(response => {
          let damageRelations = combineWeaknesses.combine(response)
          res.send(damageRelations)
      })
    // res.send('THINGS AND STUFF')
  })

  app.get('/poke/:name', (req, res) => {
    pokedex.getPokemonByName(req.params.name)
      .then(response => {
        let typesArr = []
        response.types.forEach(t => typesArr.push('/api/v2/type/'+ t.type.name))
        // console.log(typesArr);
        pokedex.resource(typesArr)
          .then(response => {
              let damageRelations = combineWeaknesses.combine(response)
              res.send(damageRelations)
          })
        // res.send(response)
      })
    // res.send('THINGS AND STUFF')
  })
}
