import React from "react";
import { stripTags } from "../utility/stringUtil";

export function DynamicRender(props) {
  let toRender = props.toRender;
  let { name, entries, type } = toRender;

  if (typeof toRender === "string") {
    return <>{stripTags(toRender)}</>;
  }

  if (type === undefined) {
    return (
      <div>
        {entries.map((ent, idx) => {
          return (
            <div key={idx}>
              {idx === 0 && (
                <>
                  <b>{stripTags(name)}.</b>{" "}
                </>
              )}
              <DynamicRender toRender={ent} />
            </div>
          );
        })}
      </div>
    );
  } else {
    switch (type) {
      case "list":
        return <ListRender list={toRender} />;
      case "item":
        return <ItemRender item={toRender} />;
      default:
        return <>[UNH {type} UNH]</>;
    }
  }
}

function ListRender(props) {
  let { type, style, items, ...others } = props.list;

  return (
    <ul>
      {items.map((it, idx) => (
        <DynamicRender toRender={it} key={idx} />
      ))}
    </ul>
  );
}

function ItemRender(props) {
  let { type, name, entry, ...others } = props.item;

  return (
    <li>
      <b>{stripTags(name)}</b> {stripTags(entry)}
    </li>
  );
}

export function SpellcastingBlock(props) {
  var entry = props.spellcasting;

  var { name, headerEntries, spells, will, daily } = entry;

  var output = [];
  var idx = 0;
  if (headerEntries && headerEntries.length > 0) {
    for (idx = 0; idx < headerEntries.length; ++idx) {
      if (idx === 0) {
        output.push(
          <div key={idx}>
            <b>{stripTags(name)}.</b> {stripTags(headerEntries[idx])}
          </div>
        );
      } else {
        output.push(<div key={idx}>{stripTags(headerEntries[idx])}</div>);
      }
    }
  } else {
    output.push(
      <div key={"name"}>
        <b>{stripTags(name)}.</b>
      </div>
    );
  }

  if (will && will.length > 0) {
    output.push(
      <div key={"will"}>
        <i>At will:</i> {will.map(stripTags).join(", ")}
      </div>
    );
  }

  if (daily) {
    let dailyKeys = Object.keys(daily);

    for (idx = 0; idx < dailyKeys.length; ++idx) {
      let [num, each] = dailyKeys[idx].split("");
      let lead = `${num}/day${each ? " each" : ""}`;

      output.push(
        <div key={"will"}>
          <i>{lead}:</i> {daily[dailyKeys[idx]].map(stripTags).join(", ")}
        </div>
      );
    }
  }

  if (spells) {
    let spellKeys = Object.keys(spells);
    let spellsBlock = spells;

    for (idx = 0; idx < spellKeys.length; ++idx) {
      let { slots, spells } = spellsBlock[spellKeys[idx]];

      let numCount = "";
      if (slots !== undefined) {
        numCount = `${slots} slot${Number.parseInt(slots) > 1 ? "s" : ""}`;
      } else {
        numCount = "at will";
      }

      let spellLevel = Number.parseInt(spellKeys[idx]);
      if (spellLevel === 0) {
        spellLevel = "Cantrips";
      } else if (spellLevel >= 4) {
        spellLevel = `${spellLevel}th level`;
      } else if (spellLevel === 1) {
        spellLevel = `${spellLevel}st level`;
      } else if (spellLevel === 2) {
        spellLevel = `${spellLevel}nd level`;
      } else if (spellLevel === 3) {
        spellLevel = `${spellLevel}rd level`;
      }

      let lead = `${spellLevel} (${numCount}): `;

      output.push(
        <div key={"will"}>
          <i>{lead}</i>
          {spells.map(stripTags).join(", ")}
        </div>
      );
    }
  }

  return <>{output}</>;
}
