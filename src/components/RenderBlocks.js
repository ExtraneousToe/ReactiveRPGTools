import React from "react";
import { stripTags } from "../utility/stringUtil";

export function DynamicRender(props) {
  let { name, entries, type } = props.entry;

  if (!type) {
    return (
      <div>
        {entries.map((ent, idx) => {
          return (
            <div key={idx}>
              {idx === 0 && (
                <>
                  <b>{name}.</b>{" "}
                </>
              )}
              {stripTags(ent)}
            </div>
          );
        })}
      </div>
    );
  }
}
