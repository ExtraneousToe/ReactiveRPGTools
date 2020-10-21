import React from "react";

export function ModularDescription(props) {
    let desc = props.description;

    if (typeof desc === "string") {
        return <SimpleDescription description={desc} />;
    } else {
        if (!desc.type) return <>ERROR on: {JSON.stringify(desc)}</>;
        switch (desc.type) {
            case "list":
                let style = desc.style;
                return <ListDescription items={desc.lines} style={style} />;
            default:
                return <SimpleDescription description={desc} />;
        }
    }
}

function SimpleDescription(props) {
    return <p>{props.description}</p>;
}

function ListDescription(props) {
    let output = [];

    for (let i = 0; i < props.items.length; ++i) {
        output.push(
            <li>
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
