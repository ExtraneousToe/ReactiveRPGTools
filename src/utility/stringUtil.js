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

// function splitForTags(str) {
//   if (str.includes("{@")) {
//     return str;
//   } else {
//     return str;
//   }
// }

export function stripTags(throughString) {
  return throughString;

  // const MAIN_PATTERN = /{(?<tag>@\w+)(?<internal>.*?)}/;
  // let matches = null;
  // let matchGroups = null;

  // do {
  //   matches = MAIN_PATTERN.exec(throughString);

  //   if (!matches) {
  //     return throughString;
  //   }

  //   matchGroups = matches.groups;

  //   switch (matchGroups.tag) {
  //     case "@b":
  //     case "@bold":
  //     case "@i":
  //     case "@italic":
  //     case "@s":
  //     case "@strike":
  //     case "@u":
  //     case "@underline":
  //       return matchGroups.internal;

  //     case "@h":
  //       return "Hit: ";

  //     case "@dc":
  //       return `DC ${matchGroups.internal}`;

  //     case "@atk":
  //     // return Renderer.attackTagToFull(text);

  //     case "@chance":
  //     case "@d20":
  //     case "@damage":
  //     case "@dice":
  //     case "@hit":
  //     case "@recharge": {
  //       // const [rollText, displayText] = Renderer.splitTagByPipe(text);
  //       switch (matchGroups.tag) {
  //         case "@damage":
  //         case "@dice": {
  //           // return displayText || rollText.replace(/;/g, "/");
  //         }
  //         case "@d20":
  //         case "@hit": {
  //           // return (
  //           //   displayText ||
  //           //   (() => {
  //           //     const n = Number(rollText);
  //           //     if (isNaN(n)) {
  //           //       throw new Error(`Could not parse "${rollText}" as a number!`);
  //           //     }
  //           //     return `${n >= 0 ? "+" : ""}${n}`;
  //           //   })()
  //           // );
  //         }
  //         case "@recharge": {
  //           // const asNum = Number(rollText || 6);
  //           // if (isNaN(asNum)) {
  //           //   throw new Error(`Could not parse "${rollText}" as a number!`);
  //           // }
  //           // return `(Recharge ${asNum}${asNum < 6 ? `\u20136` : ""})`;
  //         }
  //         case "@chance": {
  //           // return displayText || `${rollText} percent`;
  //         }
  //       }
  //       // throw new Error(`Unhandled tag: ${tag}`);
  //     }

  //     case "@comic":
  //     case "@comicH1":
  //     case "@comicH2":
  //     case "@comicH3":
  //     case "@comicH4":
  //     case "@comicNote":
  //     case "@note":
  //     case "@sense":
  //     case "@skill": {
  //       // return text;
  //     }

  //     case "@5etools":
  //     case "@adventure":
  //     case "@book":
  //     case "@filter":
  //     case "@footnote":
  //     case "@link":
  //     case "@scaledice":
  //     case "@scaledamage":
  //     case "@loader":
  //     case "@color":
  //     case "@highlight": {
  //       // const parts = Renderer.splitTagByPipe(text);
  //       // return parts[0];
  //     }

  //     case "@area": {
  //       // const [compactText, areaId, flags, ...others] = Renderer.splitTagByPipe(
  //       //   text
  //       // );
  //       // return flags && flags.includes("x")
  //       //   ? compactText
  //       //   : `${flags && flags.includes("u") ? "A" : "a"}rea ${compactText}`;
  //     }

  //     case "@action":
  //     case "@background":
  //     case "@boon":
  //     case "@class":
  //     case "@condition":
  //     case "@creature":
  //     case "@cult":
  //     case "@disease":
  //     case "@feat":
  //     case "@hazard":
  //     case "@item":
  //     case "@language":
  //     case "@object":
  //     case "@optfeature":
  //     case "@psionic":
  //     case "@race":
  //     case "@reward":
  //     case "@vehicle":
  //     case "@spell":
  //     case "@status":
  //     case "@table":
  //     case "@trap":
  //     case "@variantrule": {
  //       // const parts = Renderer.splitTagByPipe(text);
  //       // return parts.length >= 3 ? parts[2] : parts[0];
  //     }

  //     case "@deity": {
  //       // const parts = Renderer.splitTagByPipe(text);
  //       // return parts.length >= 4 ? parts[3] : parts[0];
  //     }

  //     case "@classFeature": {
  //       // const parts = Renderer.splitTagByPipe(text);
  //       // return parts.length >= 6 ? parts[5] : parts[0];
  //     }

  //     case "@subclassFeature": {
  //       // const parts = Renderer.splitTagByPipe(text);
  //       // return parts.length >= 8 ? parts[7] : parts[0];
  //     }

  //     case "@homebrew": {
  //     }
  //     default:
  //       break;
  //   }

  //   return matchGroups.internal.trim();

  //   break;
  // } while (true);

  // const TAG_PATTERN = /(?<pre>.*){@(?<tag>\S*) (?<text>[^|]*)(?<filters>|.*)?}(?<post>.*)/g;

  // let matchGroup = TAG_PATTERN.exec(throughString);
  // //console.log(throughString + " => " + JSON.stringify(matchGroup.groups));

  // if (false && matchGroup) {
  //   return matchGroup.groups.pre + " " + matchGroup.groups.text;
  // } else {
  //   return throughString;
  // }
}
