import React from "react";

export function MonsterDisplay(props) {
    let monster = props.monster;

    if (monster !== null) return <>{JSON.stringify(monster)}</>;
    else return <></>;
}
