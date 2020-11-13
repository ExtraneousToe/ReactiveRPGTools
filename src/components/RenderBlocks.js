import React from "react";
import { convertToHTML, stripTags } from "../utility/stringUtil";

export function DynamicRender(props) {
  let toRender = props.toRender;
  let { name, entries, type } = toRender;

  if (typeof toRender === "string") {
    // return <>{stripTags(toRender)}</>;
    return (
      <span dangerouslySetInnerHTML={{ __html: convertToHTML(toRender) }} />
    );
  }

  if (type === undefined) {
    return (
      <div>
        {entries.map((ent, idx) => {
          return (
            <div key={idx}>
              {idx === 0 && (
                <>
                  <b>
                    {/* {stripTags(name)} */}
                    <DynamicRender toRender={name} />.
                  </b>{" "}
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
  let {
    //type,
    style,
    items,
    //...others
  } = props.list;

  return (
    <ul className={style}>
      {items.map((it, idx) => (
        <DynamicRender toRender={it} key={idx} />
      ))}
    </ul>
  );
}

function ItemRender(props) {
  let {
    //type,
    name,
    entry,
    //...others
  } = props.item;

  return (
    <li>
      <b>{stripTags(name)}</b> {stripTags(entry)}
    </li>
  );
}

export function SpellcastingBlock(props) {
  var entry = props.spellcasting;

  var { name, headerEntries, spells, will, daily, footerEntries } = entry;

  var output = [];
  var idx = 0;
  if (headerEntries && headerEntries.length > 0) {
    output.push(
      <div key={"header"}>
        {headerEntries.map((head, idx) => {
          if (idx === 0) {
            return (
              <div key={idx}>
                <b>{stripTags(name)}.</b> {stripTags(head)}
              </div>
            );
          } else {
            return <div key={idx}>{stripTags(head)}</div>;
          }
        })}
      </div>
    );
    //   for (idx = 0; idx < headerEntries.length; ++idx) {
    //     if (idx === 0) {
    //       output.push(
    //         <div key={idx}>
    //           <b>{stripTags(name)}.</b> {stripTags(headerEntries[idx])}
    //         </div>
    //       );
    //     } else {
    //       output.push(<div key={idx}>{stripTags(headerEntries[idx])}</div>);
    //     }
    //   }
    // } else {
    //   output.push(
    //     <div key={"header"}>
    //       <b>{stripTags(name)}.</b>
    //     </div>
    //   );
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
        <div key={"daily"}>
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
        <div key={`spells-${idx}`}>
          <i>{lead}</i>
          {spells.map(stripTags).join(", ")}
        </div>
      );
    }
  }

  if (footerEntries && footerEntries.length > 0) {
    output.push(
      <div key="footer">
        {footerEntries.map((foot, idx) => {
          return <div key={idx}>{stripTags(foot)}</div>;
        })}
      </div>
    );
  }

  return <div key={name}>{output}</div>;
}
