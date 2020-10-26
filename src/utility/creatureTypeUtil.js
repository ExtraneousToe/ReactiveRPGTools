import React from "react";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";

const SWARM_REGEX = /swarm:(\w)/i;

export function CreatureTypeList(props) {
  return <>{getCreatureTypeDisplayString(props.creatureType)}</>;
}

export function getCreatureTypeDisplayString(creatureType) {
  let cType = creatureType;

  if (!cType) {
    return "-";
  } else {
    let crOut = "";

    let matches = SWARM_REGEX.exec(cType.tags.toString());
    if (matches !== null && matches.length > 0) {
      let size = "";
      switch (matches[1]) {
        case "T":
          size = "tiny";
          break;
        case "M":
          size = "medium";
          break;
        default:
          size = "[unknown size]";
          break;
      }
      crOut = `swarm of ${size} ${cType.type}s`;
    } else {
      crOut = cType.type;

      if (cType.tags.length !== 0) {
        crOut += ` (${cType.tags.join(", ")})`;
      }
    }

    return crOut;
  }
}

export function sortCreatureTypeAsc(a, b) {
  let outVal = sortStrAsc(a.type, b.type);

  if (outVal !== 0) {
    return outVal;
  }

  outVal = a.tags.length - b.tags.length;

  if (outVal !== 0) {
    return outVal;
  }

  for (let i = 0; i < a.tags.length; ++i) {
    outVal = sortStrAsc(a.tags[i], b.tags[i]);

    if (outVal !== 0) {
      return outVal;
    }
  }

  return 0;
}
