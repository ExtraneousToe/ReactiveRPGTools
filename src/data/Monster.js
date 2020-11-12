import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import BaseDataItem from "./BaseDataItem";

export class Monster extends BaseDataItem {
  static from5eSource(fiveEState) {
    let feType = null;

    switch (typeof fiveEState.type) {
      case "string":
        feType = new CreatureType({ type: fiveEState.type });
        break;
      case "object":
        let { type, tags, swarmSize } = fiveEState.type;

        let inObj = {
          type: type,
          swarmSize: swarmSize,
        };
        if (tags) {
          inObj.tags = tags.map((tg) =>
            typeof tg === "string" ? { tag: tg, prefix: "" } : tg
          );
        }

        feType = new CreatureType(inObj);

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
        feCR = new ChallengeRating(fiveEState.cr);
        break;
      case "undefined":
        feCR = new ChallengeRating({ cr: "-" });
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

    let feAlignment = [];
    if (!fiveEState.alignment) {
      // nothing
    } else if (fiveEState.alignment.every((ent) => typeof ent === "string")) {
      feAlignment.push(new Alignment({ alignment: fiveEState.alignment }));
    } else {
      feAlignment = fiveEState.alignment.map((ali) => new Alignment(ali));
    }

    return new Monster({
      name: fiveEState.name, //   name,
      referenceCardSize: 0, // referenceCardSize,
      source: fiveEState.source, // source,
      otherSources: fiveEState.otherSources, // otherSources,
      creatureSize: fiveEState.size, // creatureSize,
      creatureType: feType, // creatureType,
      stats: new StatsBlock(
        fiveEState
        // fiveEState.str,
        // fiveEState.dex,
        // fiveEState.con,
        // fiveEState.int,
        // fiveEState.wis,
        // fiveEState.cha
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
      alignment: feAlignment, // alignment
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
    super(name, source);
    this.cardSize = referenceCardSize;
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

  static stringFromSize(size) {
    switch (size) {
      case "T":
        return "Tiny";
      case "S":
        return "Small";
      case "M":
        return "Medium";
      case "L":
        return "Large";
      case "H":
        return "Huge";
      case "G":
        return "Gargantuan";
      default:
        return `?[${size}]?`;
    }
  }

  doSimpleFilter(filterString) {
    return (
      super.doSimpleFilter(filterString) ||
      this.type.displayString.toLowerCase().includes(filterString)
    );
  }
}

class Alignment {
  constructor({ alignment, chance = 100 }) {
    this.alignment = alignment;
    this.chance = chance;
  }

  get convertedString() {
    let str = this.alignment
      .map((k) => {
        switch (k) {
          case "N":
            return "neutral";
          case "C":
            return "chaotic";
          case "G":
            return "good";
          case "L":
            return "lawful";
          case "E":
            return "evil";
          case "A":
            return "any alignment";
          case "U":
            return "unaligned";
          default:
            return `?${k}?`;
        }
      })
      .join(" ");

    if (this.chance !== 100) {
      str += ` (${this.chance}%)`;
    }
    return str;
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
    var strOut = this.ac;

    if (this.from) {
      strOut = `${this.ac} (${this.from.join(", ")})`;
    } else if (this.condition) {
      strOut = `${this.ac} (${this.condition.join(", ")})`;
    }

    return strOut;
  }
}

export class CreatureType {
  constructor({ type, tags, swarmSize }) {
    this.type = type;
    this.tags = tags || [];
    this.swarmSize = swarmSize;
  }

  get displayString() {
    let str = this.type;

    if (this.swarmSize) {
      return `Swarm of ${Monster.stringFromSize(
        this.swarmSize
      ).toLowerCase()} ${this.type}${this.type !== "undead" ? "s" : ""}`;
    }

    if (this.tags.length > 0) {
      str += ` (${this.tags
        .map((tg) => {
          var tagOut = tg.tag;
          if (tg.prefix) tagOut = tg.prefix + " " + tagOut;
          return tagOut;
        })
        .join(", ")})`;
    }

    return str;
  }

  static sortAscending(a, b) {
    let outVal = sortStrAsc(a.type, b.type);

    if (outVal !== 0) {
      return outVal;
    }

    outVal = a.tags.length - b.tags.length;

    if (outVal !== 0) {
      return outVal;
    }

    for (let i = 0; i < a.tags.length; ++i) {
      outVal = sortStrAsc(a.tags[i].tag, b.tags[i].tag);

      if (outVal !== 0) {
        return outVal;
      }
    }

    return 0;
  }
}

export class ChallengeRating {
  static sortAscending(a, b) {
    if (a === null) return -1;
    if (b === null) return 1;

    let out = a.cr - b.cr;

    if (out !== 0) {
      return out;
    }

    out = a.lair - b.lair;

    if (out !== 0) {
      return out;
    }

    out = a.coven - b.coven;

    return out;
  }

  constructor({ cr, lair, coven }) {
    this.cr = cr || null;
    var matches = /\d+\/(\d+)/g.exec(this.cr);
    if (matches !== null && matches.length > 0) {
      this.cr = 1 / Number.parseInt(matches[1]);
    } else this.cr = Number.parseInt(this.cr);
    if (Number.isNaN(this.cr)) {
      this.cr = -1;
    }
    this.lair = lair || null;
    this.coven = coven || null;
  }

  get displayString() {
    if (this.cr === -1) {
      return "-";
    }

    let crOut = this.cr;

    if (typeof crOut === "number" && crOut < 1 && crOut !== 0) {
      crOut = `1/${1 / crOut}`;
    }

    if (this.coven !== null) {
      crOut += ` (${this.coven} in coven)`;
    }

    if (this.lair !== null) {
      crOut += ` (${this.lair} in lair)`;
    }

    return crOut;
  }
}

class HealthBlock {
  constructor({ average, formula }) {
    this.average = average;
    this.formula = formula;
  }
}

const SPEED_KEYS = ["walk", "fly", "climb", "swim", "burrow"];
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
    let strOut = SPEED_KEYS.map((val) => {
      if (this[val]) {
        if (val !== "walk") return `${val} ${this[val].simpleDisplay}`;
        else return `${this[val].simpleDisplay}`;
      }
      return "";
    })
      .filter((spd) => spd)
      .join(", ");

    return strOut;
  }
}

class SpeedEntry {
  constructor(inObj) {
    if (typeof inObj === "number" || inObj === 0) {
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
  constructor({ str, dex, con, int, wis, cha }) {
    this.str = str;
    this.dex = dex;
    this.con = con;
    this.int = int;
    this.wis = wis;
    this.cha = cha;
  }
}
