const allTypes = require('./types.json');

module.exports = {
  combine : types => {
    let damageRelations = {
      'double_damage_from': [],
      'double_damage_to': [],
      'half_damage_from': [],
      'half_damage_to': [],
      'no_damage_from': [],
      'no_damage_to': []
    }

    let endResult = {
      'quad_damage_from': [],
      'quarter_damage_from': [],
      'neutral_damage_from': []
    }

    let tempTypings = {}

    types.forEach(t => {
      for(var key in t.damage_relations) {
        if (t.damage_relations.hasOwnProperty(key)) {
          damageRelations[key] = damageRelations[key].concat(t.damage_relations[key])
        }
      }
    })

    const findQuadWeakness = (typings) => {
      let normalWeaknesses = []
      let doubleDmg = typings
      for (let weakness of damageRelations.double_damage_from) {
        if (normalWeaknesses.indexOf(weakness.name) === -1) {
          normalWeaknesses.push(weakness.name)
        } else {
          endResult.quad_damage_from.push(weakness)
          doubleDmg = doubleDmg.filter(w => w.name !== weakness.name)
        }
      }
      tempTypings.double_damage_from = doubleDmg
    }

    const findQuadResistance = (typings) => {
      let normalResistance = []
      let halfDmg = typings
      for (let resistance of halfDmg) {
        if (normalResistance.indexOf(resistance.name) === -1) {
          normalResistance.push(resistance.name)
        } else {
          endResult.quarter_damage_from.push(resistance)
          halfDmg = halfDmg.filter(w => w.name !== resistance.name)
        }
      }
      tempTypings.half_damage_from = halfDmg
    }

    const filterNeutralDamage = (typings) => {
      let tempHalf = typings.half_damage_from
      let tempDouble = typings.double_damage_from
      for (let weakness of tempTypings.double_damage_from) {
        for (let resistance of tempTypings.half_damage_from) {
          if (resistance.name.indexOf(weakness.name) !== -1) {
            endResult.neutral_damage_from.push(resistance)
            tempHalf = tempHalf.filter(w => w.name !== resistance.name)
            tempDouble = tempDouble.filter(w => w.name !== resistance.name)
          }
        }
      }
      endResult.half_damage_from = tempHalf
      endResult.double_damage_from = tempDouble
    }

    const filterImmunities = () => {
      for (let immunity of damageRelations.no_damage_from) {
        for (let key in damageRelations) {
          for (let item of damageRelations[key]) {
            if (item.name.indexOf(immunity.name) !== -1) {

              if (endResult.hasOwnProperty(key)) {
                endResult[key] = endResult[key].filter(w => w.name !== immunity.name)
              }
            }
          }
        }
      }
      endResult.no_damage_from = damageRelations.no_damage_from
    }

    const getRemainingNeutral = (all) => {
      let neutrals = all
      let oldNeutrals = endResult.neutral_damage_from
      for (let neutral of all.types) {
        // console.log('looking at ', neutral.name);
        for (let key in endResult) {
          for (let item of endResult[key]) {
            if (item.name.indexOf(neutral.name) !== -1) {
              if (endResult.hasOwnProperty(key)) {
                // console.log('filtering out ', neutral.name);
                neutrals.types = neutrals.types.filter(t => t.name !== neutral.name)
              }
            }
          }
        }
      }
    //  console.log('neutral damage from', allTypes.types);
      // neutrals = allTypes.types
      endResult.neutral_damage_from = oldNeutrals.concat(neutrals.types)
    }


    findQuadWeakness(damageRelations.double_damage_from)
    findQuadResistance(damageRelations.half_damage_from)
    filterNeutralDamage(tempTypings)
    filterImmunities()
    getRemainingNeutral(allTypes)


    return endResult
  }
}
