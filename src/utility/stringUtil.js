import "../css/App.css";
import React, { useContext, useState } from "react";
import { DiceRoll } from "rpg-dice-roller";
import AppTheme from "../themeContext";

// eslint-disable-next-line
Array.prototype.last =
  Array.prototype.last ||
  function (arg) {
    if (arg !== undefined) this[this.length - 1] = arg;
    else return this[this.length - 1];
  };
// STRING ==============================================================================================================
String.prototype.uppercaseFirst =
  String.prototype.uppercaseFirst ||
  function () {
    const str = this.toString();
    if (str.length === 0) return str;
    if (str.length === 1) return str.charAt(0).toUpperCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

String.prototype.lowercaseFirst =
  String.prototype.lowercaseFirst ||
  function () {
    const str = this.toString();
    if (str.length === 0) return str;
    if (str.length === 1) return str.charAt(0).toLowerCase();
    return str.charAt(0).toLowerCase() + str.slice(1);
  };

// String.prototype.toTitleCase =
//   String.prototype.toTitleCase ||
//   function () {
//     let str = this.replace(
//       /([^\W_]+[^\s-/]*) */g,
//       (m0) => m0.charAt(0).toUpperCase() + m0.substr(1).toLowerCase()
//     );

//     // Require space surrounded, as title-case requires a full word on either side
//     StrUtil._TITLE_LOWER_WORDS_RE = StrUtil._TITLE_LOWER_WORDS_RE = StrUtil.TITLE_LOWER_WORDS.map(
//       (it) => new RegExp(`\\s${it}\\s`, "gi")
//     );
//     StrUtil._TITLE_UPPER_WORDS_RE = StrUtil._TITLE_UPPER_WORDS_RE = StrUtil.TITLE_UPPER_WORDS.map(
//       (it) => new RegExp(`\\b${it}\\b`, "g")
//     );

//     const len = StrUtil.TITLE_LOWER_WORDS.length;
//     for (let i = 0; i < len; i++) {
//       str = str.replace(StrUtil._TITLE_LOWER_WORDS_RE[i], (txt) =>
//         txt.toLowerCase()
//       );
//     }

//     const len1 = StrUtil.TITLE_UPPER_WORDS.length;
//     for (let i = 0; i < len1; i++) {
//       str = str.replace(
//         StrUtil._TITLE_UPPER_WORDS_RE[i],
//         StrUtil.TITLE_UPPER_WORDS[i].toUpperCase()
//       );
//     }

//     return str;
//   };

String.prototype.toSentenceCase =
  String.prototype.toSentenceCase ||
  function () {
    const out = [];
    const re = /([^.!?]+)([.!?]\s*|$)/gi;
    let m;
    do {
      m = re.exec(this);
      if (m) {
        out.push(m[0].toLowerCase().uppercaseFirst());
      }
    } while (m);
    return out.join("");
  };

String.prototype.toSpellCase =
  String.prototype.toSpellCase ||
  function () {
    return this.toLowerCase().replace(
      /(^|of )(bigby|otiluke|mordenkainen|evard|hadar|agathys|abi-dalzim|aganazzar|drawmij|leomund|maximilian|melf|nystul|otto|rary|snilloc|tasha|tenser|jim)('s|$| )/g,
      (...m) => `${m[1]}${m[2].toTitleCase()}${m[3]}`
    );
  };

String.prototype.toCamelCase =
  String.prototype.toCamelCase ||
  function () {
    return this.split(" ")
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
      })
      .join("");
  };

String.prototype.escapeQuotes =
  String.prototype.escapeQuotes ||
  function () {
    return this.replace(/'/g, `&apos;`).replace(/"/g, `&quot;`);
  };

String.prototype.qq =
  String.prototype.qq ||
  function () {
    return this.escapeQuotes();
  };

String.prototype.unescapeQuotes =
  String.prototype.unescapeQuotes ||
  function () {
    return this.replace(/&apos;/g, `'`).replace(/&quot;/g, `"`);
  };

String.prototype.uq =
  String.prototype.uq ||
  function () {
    return this.unescapeQuotes();
  };

String.prototype.encodeApos =
  String.prototype.encodeApos ||
  function () {
    return this.replace(/'/g, `%27`);
  };

/**
 * Calculates the Damerau-Levenshtein distance between two strings.
 * https://gist.github.com/IceCreamYou/8396172
 */
String.prototype.distance =
  String.prototype.distance ||
  function (target) {
    let source = this;
    let i;
    let j;
    if (!source) return target ? target.length : 0;
    else if (!target) return source.length;

    const m = source.length;
    const n = target.length;
    const INF = m + n;
    const score = new Array(m + 2);
    const sd = {};
    for (i = 0; i < m + 2; i++) score[i] = new Array(n + 2);
    score[0][0] = INF;
    for (i = 0; i <= m; i++) {
      score[i + 1][1] = i;
      score[i + 1][0] = INF;
      sd[source[i]] = 0;
    }
    for (j = 0; j <= n; j++) {
      score[1][j + 1] = j;
      score[0][j + 1] = INF;
      sd[target[j]] = 0;
    }

    for (i = 1; i <= m; i++) {
      let DB = 0;
      for (j = 1; j <= n; j++) {
        const i1 = sd[target[j - 1]];
        const j1 = DB;
        if (source[i - 1] === target[j - 1]) {
          score[i + 1][j + 1] = score[i][j];
          DB = j;
        } else {
          score[i + 1][j + 1] =
            Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) +
            1;
        }
        score[i + 1][j + 1] = Math.min(
          score[i + 1][j + 1],
          score[i1] ? score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1) : Infinity
        );
      }
      sd[source[i - 1]] = i;
    }
    return score[m + 1][n + 1];
  };

String.prototype.isNumeric =
  String.prototype.isNumeric ||
  function () {
    return !isNaN(parseFloat(this)) && isFinite(this);
  };

String.prototype.last =
  String.prototype.last ||
  function () {
    return this[this.length - 1];
  };

String.prototype.escapeRegexp =
  String.prototype.escapeRegexp ||
  function () {
    return this.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  };

String.prototype.toUrlified =
  String.prototype.toUrlified ||
  function () {
    return encodeURIComponent(this.toLowerCase()).toLowerCase();
  };

String.prototype.toChunks =
  String.prototype.toChunks ||
  function (size) {
    // https://stackoverflow.com/a/29202760/5987433
    const numChunks = Math.ceil(this.length / size);
    const chunks = new Array(numChunks);
    for (let i = 0, o = 0; i < numChunks; ++i, o += size)
      chunks[i] = this.substr(o, size);
    return chunks;
  };

Array.prototype.joinConjunct =
  Array.prototype.joinConjunct ||
  function (joiner, lastJoiner, nonOxford) {
    if (this.length === 0) return "";
    if (this.length === 1) return this[0];
    if (this.length === 2) return this.join(lastJoiner);
    else {
      let outStr = "";
      for (let i = 0; i < this.length; ++i) {
        outStr += this[i];
        if (i < this.length - 2) outStr += joiner;
        else if (i === this.length - 2)
          outStr += `${
            !nonOxford && this.length > 2 ? joiner.trim() : ""
          }${lastJoiner}`;
      }
      return outStr;
    }
  };

export function sortAscending(a, b) {
  let x = a.toLowerCase();
  let y = b.toLowerCase();

  if (y < x) {
    return 1;
  }
  if (x < y) {
    return -1;
  }
  return 0;
}

const splitFirstSpace = function (string) {
  const firstIndex = string.indexOf(" ");
  return firstIndex === -1
    ? [string, ""]
    : [string.substr(0, firstIndex), string.substr(firstIndex + 1)];
};

function _splitByTagsBase(leadingCharacter) {
  return function (string) {
    let tagDepth = 0;
    let char, char2;
    const out = [];
    let curStr = "";
    let isLastOpen = false;

    const len = string.length;
    for (let i = 0; i < len; ++i) {
      char = string[i];
      char2 = string[i + 1];

      switch (char) {
        case "{":
          isLastOpen = true;
          if (char2 === leadingCharacter) {
            if (tagDepth++ > 0) {
              curStr += "{";
            } else {
              out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));
              curStr = `{${leadingCharacter}`;
              ++i;
            }
          } else curStr += "{";
          break;

        case "}":
          isLastOpen = false;
          curStr += "}";
          if (tagDepth !== 0 && --tagDepth === 0) {
            out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));
            curStr = "";
          }
          break;

        case leadingCharacter: {
          if (!isLastOpen) curStr += "<VE_LEAD>";
          else curStr += leadingCharacter;
          break;
        }

        default:
          isLastOpen = false;
          curStr += char;
          break;
      }
    }

    if (curStr) out.push(curStr.replace(/<VE_LEAD>/g, leadingCharacter));

    return out;
  };
}

const splitByTags = _splitByTagsBase("@");

const attackTagToFull = function (tagStr) {
  function renderTag(tags) {
    return `${
      tags.includes("m")
        ? "Melee "
        : tags.includes("r")
        ? "Ranged "
        : tags.includes("g")
        ? "Magical "
        : tags.includes("a")
        ? "Area "
        : ""
    }${tags.includes("w") ? "Weapon " : tags.includes("s") ? "Spell " : ""}`;
  }

  const tagGroups = tagStr
    .toLowerCase()
    .split(",")
    .map((it) => it.trim())
    .filter((it) => it)
    .map((it) => it.split(""));
  if (tagGroups.length > 1) {
    const seen = new Set(tagGroups.last());
    for (let i = tagGroups.length - 2; i >= 0; --i) {
      tagGroups[i] = tagGroups[i].filter((it) => {
        const out = !seen.has(it);
        seen.add(it);
        return out;
      });
    }
  }
  return `${tagGroups.map((it) => renderTag(it)).join(" or ")}Attack:`;
};

const _splitByPipeBase = function (leadingCharacter) {
  return function (string) {
    let tagDepth = 0;
    let char, char2;
    const out = [];
    let curStr = "";

    const len = string.length;
    for (let i = 0; i < len; ++i) {
      char = string[i];
      char2 = string[i + 1];

      switch (char) {
        case "{":
          if (char2 === leadingCharacter) tagDepth++;
          curStr += "{";

          break;

        case "}":
          if (tagDepth) tagDepth--;
          curStr += "}";

          break;

        case "|": {
          if (tagDepth) curStr += "|";
          else {
            out.push(curStr);
            curStr = "";
          }
          break;
        }

        default: {
          curStr += char;
          break;
        }
      }
    }

    if (curStr) out.push(curStr);
    return out;
  };
};

const splitTagByPipe = _splitByPipeBase("@");

const _stripTagLayer = function (str) {
  if (str.includes("{@")) {
    const tagSplit = splitByTags(str);
    return tagSplit
      .filter((it) => it)
      .map((it) => {
        if (it.startsWith("{@")) {
          let [tag, text] = splitFirstSpace(it.slice(1, -1));
          text = text.replace(/<\$([^$]+)\$>/gi, ""); // remove any variable tags
          switch (tag) {
            case "@b":
            case "@bold":
            case "@i":
            case "@italic":
            case "@s":
            case "@strike":
            case "@u":
            case "@underline":
              return text;

            case "@h":
              return "Hit: ";

            case "@dc":
              return `DC ${text}`;

            case "@atk":
              return attackTagToFull(text);

            case "@chance":
            case "@d20":
            case "@damage":
            case "@dice":
            case "@hit":
            case "@recharge": {
              const [rollText, displayText] = splitTagByPipe(text);
              switch (tag) {
                case "@damage":
                case "@dice": {
                  return displayText || rollText.replace(/;/g, "/");
                }
                case "@d20":
                case "@hit": {
                  return (
                    displayText ||
                    (() => {
                      const n = Number(rollText);
                      if (isNaN(n)) {
                        throw new Error(
                          `Could not parse "${rollText}" as a number!`
                        );
                      }
                      return `${n >= 0 ? "+" : ""}${n}`;
                    })()
                  );
                }
                case "@recharge": {
                  const asNum = Number(rollText || 6);
                  if (isNaN(asNum)) {
                    throw new Error(
                      `Could not parse "${rollText}" as a number!`
                    );
                  }
                  return `(Recharge ${asNum}${asNum < 6 ? `\u20136` : ""})`;
                }
                case "@chance": {
                  return displayText || `${rollText} percent`;
                }
                default:
                  throw new Error(`Unhandled tag: ${tag}`);
              }
            }

            case "@comic":
            case "@comicH1":
            case "@comicH2":
            case "@comicH3":
            case "@comicH4":
            case "@comicNote":
            case "@note":
            case "@sense":
            case "@skill": {
              return text;
            }

            case "@5etools":
            case "@adventure":
            case "@book":
            case "@filter":
            case "@footnote":
            case "@link":
            case "@scaledice":
            case "@scaledamage":
            case "@loader":
            case "@color":
            case "@highlight": {
              const parts = splitTagByPipe(text);
              return parts[0];
            }

            case "@area": {
              const [
                compactText,
                /*areaId,*/ flags,
                //...others
              ] = splitTagByPipe(text);

              return flags && flags.includes("x")
                ? compactText
                : `${
                    flags && flags.includes("u") ? "A" : "a"
                  }rea ${compactText}`;
            }

            case "@action":
            case "@background":
            case "@boon":
            case "@class":
            case "@condition":
            case "@creature":
            case "@cult":
            case "@disease":
            case "@feat":
            case "@hazard":
            case "@item":
            case "@language":
            case "@object":
            case "@optfeature":
            case "@psionic":
            case "@race":
            case "@reward":
            case "@vehicle":
            case "@spell":
            case "@status":
            case "@table":
            case "@trap":
            case "@variantrule": {
              const parts = splitTagByPipe(text);
              return parts.length >= 3 ? parts[2] : parts[0];
            }

            case "@deity": {
              const parts = splitTagByPipe(text);
              return parts.length >= 4 ? parts[3] : parts[0];
            }

            case "@classFeature": {
              const parts = splitTagByPipe(text);
              return parts.length >= 6 ? parts[5] : parts[0];
            }

            case "@subclassFeature": {
              const parts = splitTagByPipe(text);
              return parts.length >= 8 ? parts[7] : parts[0];
            }

            case "@homebrew": {
              const [newText, oldText] = splitTagByPipe(text);
              if (newText && oldText) {
                return `${newText} [this is a homebrew addition, replacing the following: "${oldText}"]`;
              } else if (newText) {
                return `${newText} [this is a homebrew addition]`;
              } else if (oldText) {
                return `[the following text has been removed due to homebrew: ${oldText}]`;
              } else
                throw new Error(`Homebrew tag had neither old nor new text!`);
            }

            default:
              throw new Error(`Unhandled tag: "${tag}"`);
          }
        } else return it;
      })
      .join("");
  }
  return str;
};

export function stripTags(str) {
  try {
    if (!str) return str;
    let nxtStr = _stripTagLayer(str);
    while (nxtStr.length !== str.length) {
      str = nxtStr;
      nxtStr = _stripTagLayer(str);
    }
    return nxtStr;
  } catch (err) {
    console.error(`On [${str}]: ${err}`);
    return str;
  }
}

function execDiceRegex(line) {
  return /\{@dice (.*?)\}/gi.exec(line);
}

function stringToken(cnt) {
  return {
    type: "string",
    cnt,
  };
}
function rollableToken(cnt) {
  return {
    type: "rollable",
    cnt,
  };
}

export function tokeniseByTags(inputString) {
  const outputTokens = [];
  let workingLine = inputString;

  let matches = execDiceRegex(workingLine);
  let matchIndex = -1;
  let preString, postString;

  if (matches === null) {
    outputTokens.push(stringToken(workingLine));
    return outputTokens;
  }

  while (matches !== null) {
    // index of the match
    matchIndex = workingLine.indexOf(matches[0]);
    // split up the string
    preString = workingLine.substr(0, matchIndex);
    const formula = matches[1];
    postString = workingLine.substr(matchIndex + matches[0].length);

    outputTokens.push(stringToken(preString));
    outputTokens.push(rollableToken(formula));

    workingLine = postString;
    matches = execDiceRegex(workingLine);
  }

  outputTokens.push(stringToken(workingLine));

  return outputTokens;
}

export function RollableSpan(props) {
  const { formula } = props;
  let [rolledResult, setRolledResult] = useState("");
  const appTheme = useContext(AppTheme);

  return (
    <span
      onClick={() => {
        const res = new DiceRoll(formula).total;
        setRolledResult(res);
      }}
      className={`clickable ${appTheme.theme.styleName}`}
    >
      {rolledResult !== "" ? `[${rolledResult}]` : formula}
    </span>
  );
}

export function rollableTokenisedLine(line) {
  return tokeniseByTags(line).map((tok, idx) => {
    switch (tok.type) {
      case "string":
        return <span key={idx}>{tok.cnt}</span>;
      case "rollable":
        return <RollableSpan key={idx} formula={tok.cnt} />;
    }
  });
}

function execTokenRegex(line) {
  return /\{@(.*?)\}/gi.exec(line);
}

export function convertToHTML(inStr) {
  let outputString = "";
  let workingLine = inStr;

  let matches = execTokenRegex(workingLine);
  let matchIndex = -1;
  let preString, postString;

  if (matches === null) {
    return inStr;
  }

  while (matches !== null) {
    // index of the match
    matchIndex = workingLine.indexOf(matches[0]);
    // split up the string
    preString = workingLine.substr(0, matchIndex);
    // const formula = matches[1];
    postString = workingLine.substr(matchIndex + matches[0].length);

    // outputTokens.push(stringToken(preString));
    outputString += preString;

    let [tag, pipedText] = splitFirstSpace(matches[1]);
    outputString += generateHTMLByTag(tag, pipedText);
    // outputTokens.push(rollableToken(formula));

    workingLine = postString;
    matches = execTokenRegex(workingLine);
  }

  outputString += postString;

  return outputString;
}

function generateHTMLByTag(tag, pipedText) {
  tag = `@${tag}`;
  switch (tag) {
    case "@b":
    case "@bold":
      return `<b>${pipedText}</b>`;
    case "@i":
    case "@italic":
    case "@condition":
      return `<i>${pipedText}</i>`;
    case "@s":
    case "@strike":
      return `<s>${pipedText}</s>`;
    case "@u":
    case "@underline":
      return `<u>${pipedText}</u>`;
    case "@note":
      return `<i class="ve-muted">${pipedText}</i>`;
    case "@atk":
      return `<i>${attackTagToFull(pipedText)}</i>`;
    case "@h":
      return `<i>Hit:</i> `;
    case "@color": {
      const [toDisplay, color] = splitTagByPipe(pipedText);
      const scrubbedColor = color; // BrewUtil.getValidColor(color);

      return `<span style="color: #${scrubbedColor}">${toDisplay}</span>`;
    }
    case "@highlight": {
      const [toDisplay, color] = splitTagByPipe(pipedText);
      const scrubbedColor = color; // ? BrewUtil.getValidColor(color) : null;

      return (
        (scrubbedColor
          ? `<span style="background-color: #${scrubbedColor}">`
          : `<span class="rd__highlight">`) +
        toDisplay +
        `</span>`
      );
    }

    // Comic styles ////////////////////////////////////////////////////////////////////////////////////
    case "@comic":
      return `<span class="rd__comic">` + pipedText + `</span>`;
    case "@comicH1":
      return `<span class="rd__comic rd__comic--h1">` + pipedText + `</span>`;
    case "@comicH2":
      return `<span class="rd__comic rd__comic--h2">` + pipedText + `</span>`;
    case "@comicH3":
      return `<span class="rd__comic rd__comic--h3">` + pipedText + `</span>`;
    case "@comicH4":
      return `<span class="rd__comic rd__comic--h4">` + pipedText + `</span>`;
    case "@comicNote":
      return `<span class="rd__comic rd__comic--note">` + pipedText + `</span>`;

    // DCs /////////////////////////////////////////////////////////////////////////////////////////////
    case "@dc": {
      return `DC <span class="rd__dc">${pipedText}</span>`;
    }

    // DICE ////////////////////////////////////////////////////////////////////////////////////////////
    case "@dice":
    case "@damage":
    case "@hit":
    case "@d20":
    case "@chance":
    case "@recharge": {
      // const fauxEntry = {
      // 	type: "dice",
      // 	rollable: true,
      // };
      const [rollText, displayText, name, ...others] = splitTagByPipe(
        pipedText
      );
      // if (displayText) fauxEntry.displayText = displayText;
      // if (name) fauxEntry.name = name;

      const diceForm = {};

      switch (tag) {
        case "@dice": {
          diceForm.subType = "dice";
          diceForm.toRoll = rollText;
          diceForm.displayText = displayText || rollText;
          break;
        }
        case "@damage": {
          diceForm.subType = "damage";
          diceForm.toRoll = rollText;
          diceForm.displayText = displayText || rollText;
          break;
        }
        case "@d20":
        case "@hit": {
          diceForm.subType = "d20";
          // 		// format: {@hit +1} or {@hit -2}
          const n = Number(rollText);
          const mod = `${n >= 0 ? "+" : ""}${n}`;
          // 		fauxEntry.displayText = fauxEntry.displayText || mod;
          // 		fauxEntry.toRoll = `1d20${mod}`;
          // 		fauxEntry.subType = "d20";
          // 		fauxEntry.d20mod = mod;
          // 		this._recursiveRender(fauxEntry, textStack, meta);
          diceForm.toRoll = `1d20${mod}`;
          diceForm.displayText = displayText || mod;
          break;
        }
        case "@chance": {
          // 		// format: {@chance 25|display text|rollbox rollee name}
          diceForm.subType = "chance";
          diceForm.toRoll = `1d100`;
          diceForm.successThresh = Number(rollText);
          diceForm.displayText = displayText || rollText;
          break;
        }
        case "@recharge": {
          // 		// format: {@recharge 4|flags}
          diceForm.subType = "recharge";

          const flags = displayText ? displayText.split("") : null; // "m" for "minimal" = no brackets
          diceForm.toRoll = `1d6`;
          const asNum = Number(rollText || 6);

          diceForm.successThresh = 7 - asNum;
          diceForm.successMax = 6;
          // 		textStack[0] += `${flags && flags.includes("m") ? "" : "("}Recharge `;
          diceForm.displayText = `${asNum}${asNum < 6 ? `\u20136` : ""}`;
          // 		this._recursiveRender(fauxEntry, textStack, meta);
          // 		textStack[0] += `${flags && flags.includes("m") ? "" : ")"}`;
          break;
        }
      }

      diceForm.displayText = diceForm.displayText || rollText;
      // return `<span class='clickable' onmousedown='event.preventDefault()' onclick="rollElement(event.target)" data-dice-form='${JSON.stringify(
      //   diceForm
      // ).escapeQuotes()}'>${diceForm.displayText}</span>`;

      return renderRollableSubType(diceForm);
    }

    case "@filter":
    case "@link":
    case "@5etools":
    case "@footnote": {
      // format: {@filter Warlock Spells|spells|level=1;2|class=Warlock}
      const [displayText, ...others] = splitTagByPipe(pipedText);
      return displayText;
    }
    case "@skill":
    case "@sense": {
      const [name, displayText] = splitTagByPipe(pipedText);
      return `<span class="help--hover">${displayText || name}</span>`;
    }
    case "@area":
    case "@loader":
    case "@book":
    case "@adventure":
    case "@deity":
    case "@classFeature":
    case "@subclassFeature":
    case "@homebrew":
    case "@scaledice":
    case "@scaledamage": {
      return `{@${tag} ${pipedText}}`;
    }

    default: {
      break;
    }
  }

  return `[${tag} <> ${pipedText}]`;
}

export function renderRollableSubType(diceForm) {
  let builtString = `<span class='clickable' onmousedown='event.preventDefault()' onclick="rollElement(event.target)" data-dice-form='${JSON.stringify(
    diceForm
  ).escapeQuotes()}'>${diceForm.displayText}</span>`;

  switch (diceForm.subType) {
    case "recharge":
      builtString = `(Recharge ${builtString})`;
      break;
    default:
      break;
  }

  return builtString;
}

export function rollElement(ele) {
  const $ele = $(ele);
  const diceForm = $ele.data("dice-form");

  const roll = new DiceRoll(diceForm.toRoll);

  switch (diceForm.subType) {
    case "recharge":
      $ele.html(
        `[${roll.total} -> ${
          roll.total >= 7 - diceForm.successThresh
            ? "recharged!"
            : "not this time"
        }]`
      );
      break;
    case "chance":
      $ele.html(
        `[${roll.total} -> ${
          roll.total <= diceForm.successThresh ? "success" : "failure"
        }]`
      );
      break;
    default:
      $ele.html(`[${roll.total}]`);
      break;
  }

  console.log(roll.output);
}
const $ = window.$;
window.rollElement = rollElement;
