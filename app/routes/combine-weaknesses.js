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
        const existsInResist = tempTypings.half_damage_from.some(hd => hd.name === weakness.name)
        if (existsInResist) {
          endResult.neutral_damage_from.push(weakness)
          tempHalf = tempHalf.filter(w => w.name !== weakness.name)
          tempDouble = tempDouble.filter(w => w.name !== weakness.name)
        }
      }
      endResult.half_damage_from = tempHalf
      endResult.double_damage_from = tempDouble
    }

    const filterImmunities = () => {
      for (let key in damageRelations) {
        for (let item of damageRelations[key]) {
          const isImmunity = damageRelations.no_damage_from.some(immunity => immunity.name === item.name)
          if (isImmunity && endResult.hasOwnProperty(key)) {
            endResult[key] = endResult[key].filter(w => w.name !== item.name)
          }
        }
      }
      endResult.no_damage_from = damageRelations.no_damage_from
    }

    findQuadWeakness(damageRelations.double_damage_from)
    findQuadResistance(damageRelations.half_damage_from)
    filterNeutralDamage(tempTypings)
    filterImmunities()

    return endResult
  }
}
