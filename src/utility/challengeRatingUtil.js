import React from "react";

export function CRList(props) {
  return <>{getChallengeRatingDisplayString(props.cr)}</>;
}

export function getChallengeRatingDisplayString(challengeRating) {
  let cr = challengeRating;

  if (!cr) {
    return "-";
  } else {
    let crOut = cr.cr;

    if (typeof crOut === "number" && crOut < 1 && crOut !== 0) {
      crOut = `1/${1 / crOut}`;
    }

    if (cr.coven !== null) {
      crOut += ` (${cr.coven} in coven)`;
    }

    if (cr.lair !== null) {
      crOut += ` (${cr.lair} in lair)`;
    }

    return crOut;
  }
}

export function sortAscending(a, b) {
  if (a === null) return -1;
  if (b === null) return 1;

  let out = a.cr - b.cr;

  if (out !== 0) {
    return out;
  }

  out = a.InLair - b.InLair;

  if (out !== 0) {
    return out;
  }

  out = a.InCoven - b.InCoven;

  return out;
}
