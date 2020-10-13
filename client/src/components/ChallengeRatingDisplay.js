import React from "react";

export function CRList(props) {
    let cr = props.cr;

    if (cr === null || cr === undefined) {
        return <>-</>;
    } else {
        let crOut = cr.CR;

        if (cr.InCoven !== null) {
            crOut += ` (${cr.InCoven} in coven)`;
        }

        if (cr.InLair !== null) {
            crOut += ` (${cr.InLair} in lair)`;
        }

        return <>{crOut}</>;
    }
}
