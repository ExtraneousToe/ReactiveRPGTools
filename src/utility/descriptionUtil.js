import React from "react";
import { stripTags } from "./stringUtil";

export function ModularDescription(props) {
  let desc = props.description;

  if (typeof desc === "string") {
    return <SimpleDescription description={desc} />;
  } else {
    if (!desc.type) return <>ERROR on: {JSON.stringify(desc)}</>;
    switch (desc.type) {
      case "list":
        let style = desc.style;
        return (
          <ListDescription items={desc.lines || desc.items} style={style} />
        );
      case "item":
        return <ItemDescription description={desc} />;
      default:
        return <UnhandledDescription description={desc} />;
    }
  }
}

function SimpleDescription(props) {
  return <p>{stripTags(props.description)}</p>;
}

function ItemDescription(props) {
  return (
    <p>
      <b>{props.description.name}</b> {stripTags(props.description.entry)}
    </p>
  );
}

function UnhandledDescription(props) {
  return <p>{JSON.stringify(props.description)}</p>;
}

function ListDescription(props) {
  let output = [];

  for (let i = 0; i < props.items.length; ++i) {
    output.push(
      <li key={i}>
        <ModularDescription description={props.items[i]} />
      </li>
    );
  }

  let styleObj = {};
  if (props.style) {
    styleObj.listStyle = props.style;
  }

  return <ul style={styleObj}>{output}</ul>;
}
