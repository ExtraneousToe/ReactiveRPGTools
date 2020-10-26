export class Monster {
  static from5eSource(fiveEState) {
    let feType = null;

    switch (typeof fiveEState.type) {
      case "string":
        feType = new CreatureType({ type: fiveEState.type });
        break;
      case "object":
        feType = new CreatureType({
          type: fiveEState.type.type,
          tags: fiveEState.type.tags,
        });
        break;
      default:
        console.log(
          `Unhandled creatureType type: ${typeof fiveEState.type} => ${
            fiveEState.type
          } of ${fiveEState.name}`
        );
        break;
    }

    let feCR = null;

    switch (typeof fiveEState.cr) {
      case "string":
        feCR = new ChallengeRating({ cr: fiveEState.cr });
        break;
      case "object":
        feCR = new ChallengeRating({
          cr: fiveEState.cr.cr,
          lair: fiveEState.cr.lair,
          coven: fiveEState.cr.coven,
        });
        break;
      case "undefined":
        feCR = new ChallengeRating({});
        break;
      default:
        console.log(
          `Unhandled CR type: ${typeof fiveEState.cr} => ${fiveEState.cr} of ${
            fiveEState.name
          }`
        );
        break;
    }

    let feACLines = [];
    for (let i = 0; i < fiveEState.ac.length; ++i) {
      let line = fiveEState.ac[i];
      let acObj = {};

      switch (typeof line) {
        case "number":
          acObj.ac = line;
          break;
        case "string":
          acObj.ac = Number.parseInt(line);
          break;
        case "object":
          acObj.ac = Number.parseInt(line.ac);
          acObj.from = line.from;
          acObj.condition = line.condition;
          break;
        default:
          console.log(
            `Unhandled AC type: ${typeof fiveEState.ac} => ${
              fiveEState.ac
            } of ${fiveEState.name}`
          );
          break;
      }

      feACLines.push(new ArmorClass(acObj));
    }

    return new Monster({
      name: fiveEState.name, //   name,
      referenceCardSize: 0, // referenceCardSize,
      source: fiveEState.source, // source,
      otherSources: fiveEState.otherSources, // otherSources,
      size: fiveEState.size, // creatureSize,
      creatureType: feType, // creatureType,
      stats: new StatsBlock(
        fiveEState.str,
        fiveEState.dex,
        fiveEState.con,
        fiveEState.int,
        fiveEState.wis,
        fiveEState.cha
      ), // stats,
      armorClass: feACLines, // armorClass,
      challengeRating: feCR, // challengeRating,
      health: new HealthBlock(fiveEState.hp), // health,
      passivePerc: fiveEState.passive, // passivePerc,
      languages: fiveEState.languages, // languages,
      speed: new SpeedBlock({
        walk: fiveEState.speed.walk,
        fly: fiveEState.speed.fly,
        swim: fiveEState.speed.swim,
        climb: fiveEState.speed.climb,
        burrow: fiveEState.speed.burrow,
        canHover: fiveEState.speed.canHover,
      }), // speed,
      saves: fiveEState.save, // saves,
      skills: fiveEState.skill, // skills,
      senses: fiveEState.senses, // senses,
      alignment: fiveEState.alignment, // alignment
      resistances: fiveEState.resist, // resistances
      immunities: fiveEState.immune, // immunity
      conditionImmunities: fiveEState.conditionImmune, // conditionImmunities
      traits: fiveEState.trait, //traits
      spellcasting: fiveEState.spellcasting, //spellcasting
      actions: fiveEState.action, //actions
      reactions: fiveEState.reaction, //reactions
      environments: fiveEState.environment, //environments
      legendaryHeader: fiveEState.legendaryHeader, //legendaryHeader
      legendaryActions: fiveEState.legendary, //legendaryActions
    });
  }

  static fromCombinedSources(oldState, fiveEState) {
    let feType = null;

    switch (typeof fiveEState.type) {
      case "string":
        feType = new CreatureType({ type: fiveEState.type });
        break;
      case "object":
        feType = new CreatureType({
          type: fiveEState.type.type,
          tags: fiveEState.type.tags,
        });
        break;
      default:
        console.log(`Unhandled creatureType type: ${typeof fiveEState.type}`);
        break;
    }

    let feCR = null;

    switch (typeof fiveEState.cr) {
      case "string":
        feCR = new ChallengeRating({ cr: fiveEState.cr });
        break;
      case "object":
        feCR = new ChallengeRating({
          cr: fiveEState.cr.cr,
          lair: fiveEState.cr.lair,
          coven: fiveEState.cr.coven,
        });
        break;
      default:
        console.log(`Unhandled CR type: ${typeof fiveEState.type}`);
        break;
    }

    let feACLines = [];
    for (let i = 0; i < fiveEState.ac.length; ++i) {
      let line = fiveEState.ac[i];
      let acObj = {};

      switch (typeof fiveEState.cr) {
        case "number":
          acObj.ac = line;
          break;
        case "string":
          acObj.ac = Number(line);
          break;
        case "object":
          acObj.ac = line.ac;
          acObj.from = line.from;
          break;
        default:
          console.log(`Unhandled AC type: ${typeof fiveEState.type}`);
          break;
      }

      feACLines.push(new ArmorClass(acObj));
    }

    return new Monster(
      fiveEState.name, //   name,
      oldState ? oldState.referenceCardSize : 0, // referenceCardSize,
      fiveEState.source, // source,
      fiveEState.otherSources, // otherSources,
      fiveEState.size, // creatureSize,
      feType, // creatureType,
      new StatsBlock(
        fiveEState.str,
        fiveEState.dex,
        fiveEState.con,
        fiveEState.int,
        fiveEState.wis,
        fiveEState.cha
      ), // stats,
      feACLines, // armorClass,
      feCR, // challengeRating,
      new HealthBlock(fiveEState.hp), // health,
      fiveEState.passive, // passivePerc,
      fiveEState.languages, // languages,
      new SpeedBlock(fiveEState.speed), // speed,
      fiveEState.save, // saves,
      fiveEState.skill, // skills,
      fiveEState.senses, // senses,
      fiveEState.alignment, // alignment
      fiveEState.resist, // resistance
      fiveEState.immune, // immunity
      fiveEState.conditionImmune, // condition immunity
      [], //traits, //traits
      [], //spellcasting, //spellcasting
      [], //actions, //actions
      [], //reactions, //reactions
      [], //environments, //environments
      [], //legendaryHeader, //legendaryHeader
      [], //legendaryActions, //legendaryActions
      oldState ? new HarvestingTable(oldState.HarvestingTable) : null, // harvestingTable
      oldState ? oldState.TrinketTableType : null // trinketTableType
    );
  }

  constructor({
    name,
    referenceCardSize,
    source,
    otherSources,
    creatureSize,
    creatureType,
    stats,
    armorClass,
    challengeRating,
    health,
    passivePerc,
    languages,
    speed,
    saves,
    skills,
    senses,
    alignment,
    resistances,
    immunities,
    conditionImmunities,
    traits,
    spellcasting,
    actions,
    reactions,
    environments,
    legendaryHeader,
    legendaryActions,
    harvestingTable,
    trinketTableType,
  }) {
    this.name = name;
    this.cardSize = referenceCardSize;
    this.source = source;
    this.otherSources = otherSources || [];
    this.size = creatureSize;
    this.type = creatureType;
    this.speed = speed;
    this.stats = stats;
    this.saves = saves || null;
    this.skills = skills;
    this.senses = senses;
    this.armorClass = armorClass;
    this.health = health;
    this.passivePerc = passivePerc;
    this.languages = languages;
    this.challengeRating = challengeRating;
    this.resistances = resistances || null;
    this.immunities = immunities || null;
    this.conditionImmunities = conditionImmunities || null;
    this.alignment = alignment;
    this.traits = traits || [];
    this.spellcasting = spellcasting || [];
    this.actions = actions || [];
    this.reactions = reactions || [];
    this.environments = environments || [];
    this.legendaryHeader = legendaryHeader;
    this.legendaryActions = legendaryActions || [];
    this.harvestingTable = harvestingTable || null;
    this.trinketTableType = trinketTableType || null;
  }

  get id() {
    return (
      this.name.replace(/[\s'\-()]/g, "") +
      "_" +
      this.source
    ).toLowerCase();
  }
}

// Monster Bits
class ArmorClass {
  constructor({ ac, from, condition }) {
    this.ac = ac;
    this.from = from;
    this.condition = condition;
  }

  get simpleDisplay() {
    //return JSON.stringify(this);
    var strOut = this.ac;

    if (this.from) {
      strOut = `${this.ac} (${this.from.join(", ")})`;
    } else if (this.condition) {
      strOut = `${this.ac} (${this.condition.join(", ")})`;
    }

    return strOut;
  }
}

class CreatureType {
  constructor({ type, tags }) {
    this.type = type;
    this.tags = tags || [];
  }
}

class ChallengeRating {
  constructor({ cr, lair, coven }) {
    this.cr = cr || null;
    var matches = /\d+\/(\d+)/g.exec(this.cr);
    if (matches !== null && matches.length > 0) {
      this.cr = 1 / Number.parseInt(matches[1]);
    } else this.cr = Number.parseInt(this.cr);
    this.lair = lair || null;
    this.coven = coven || null;
  }
}

class HealthBlock {
  constructor({ average, formula }) {
    this.average = average;
    this.formula = formula;
  }
}

const SPEED_KEYS = ["fly", "climb", "swim", "burrow"];
class SpeedBlock {
  constructor({ walk, fly, climb, swim, burrow, canHover }) {
    this.walk = walk !== undefined ? new SpeedEntry(walk) : null;
    this.fly = fly !== undefined ? new SpeedEntry(fly) : null;
    this.climb = climb !== undefined ? new SpeedEntry(climb) : null;
    this.swim = swim !== undefined ? new SpeedEntry(swim) : null;
    this.burrow = burrow !== undefined ? new SpeedEntry(burrow) : null;
    this.canHover = canHover !== undefined ? canHover : false;
  }

  get simpleDisplay() {
    //return JSON.stringify(this);

    let strOut = `${this.walk.ft} ft.`;

    SPEED_KEYS.forEach((val) => {
      if (this[val]) {
        strOut += `, ${val} ${this[val].simpleDisplay}`;
      }
    });

    return strOut;
  }
}
//SpeedBlock.prototype.defineProperty("canHover", { enumerable: false });

class SpeedEntry {
  constructor(inObj) {
    if (typeof inObj === "number" || inObj == 0) {
      this.ft = inObj;
      this.condition = null;
    } else {
      this.ft = inObj.number;
      this.condition = inObj.condition;
    }
  }

  get simpleDisplay() {
    if (!this.condition) {
      return `${this.ft} ft.`;
    } else {
      return `${this.ft} ft. ${this.condition}`;
    }
  }
}

class StatsBlock {
  constructor(str, dex, con, int, wis, cha) {
    this.str = str;
    this.dex = dex;
    this.con = con;
    this.int = int;
    this.wis = wis;
    this.cha = cha;
  }
}

// HarvestingTables
class HarvestingTable {
  constructor(inObj) {
    this.rows = [];
    for (let i = 0; i < inObj.rows; ++i) {
      this.rows.push(new HarvestingTableRow(inObj.rows[i]));
    }
  }
}

class HarvestingTableRow {
  constructor(inObj) {
    this.dc = inObj.DifficultyClass;
    this.itemNameRef = inObj.ItemNameRef;
    this.qty = inObj.Quantity;
    this.notes = inObj.Notes;
  }
}
