import React from "react";

export function CRList(props) {
  let cr = props.cr;

  if (!cr) {
    return <>-</>;
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

    return <>{crOut}</>;
  }
}
