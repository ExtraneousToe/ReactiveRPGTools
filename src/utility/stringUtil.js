// eslint-disable-next-line
Array.prototype.last =
  Array.prototype.last ||
  function (arg) {
    if (arg !== undefined) this[this.length - 1] = arg;
    else return this[this.length - 1];
  };
// eslint-disable-next-line
String.prototype.last =
  String.prototype.last ||
  function () {
    return this[this.length - 1];
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
