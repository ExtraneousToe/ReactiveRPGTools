import React from "react";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";

const SWARM_REGEX = /swarm:(\w)/i;

export function CreatureTypeList(props) {
    return <>{getCreatureTypeDisplayString(props.creatureType)}</>;
}

export function getCreatureTypeDisplayString(creatureType) {
    let cType = creatureType;

    if (cType === null || cType === undefined) {
        return "-";
    } else {
        let crOut = "";

        let matches = SWARM_REGEX.exec(cType.Tags.toString());
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
            crOut = `swarm of ${size} ${cType.Type}s`;
        } else {
            crOut = cType.Type;

            if (cType.Tags.length !== 0) {
                crOut += ` (${cType.Tags.join(", ")})`;
            }
        }

        return crOut;
    }
}

export function sortCreatureTypeAsc(a, b) {
    let outVal = sortStrAsc(a.Type, b.Type);

    if (outVal !== 0) {
        return outVal;
    }

    outVal = a.Tags.length - b.Tags.length;

    if (outVal !== 0) {
        return outVal;
    }

    for (let i = 0; i < a.Tags.length; ++i) {
        outVal = sortStrAsc(a.Tags[i], b.Tags[i]);

        if (outVal !== 0) {
            return outVal;
        }
    }

    return 0;
}
