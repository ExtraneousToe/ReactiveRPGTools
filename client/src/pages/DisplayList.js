import React from "react";
import { useHistory } from "react-router";
import { Row, Col } from "reactstrap";
import "./DisplayList.css";

export function DisplayList(props) {
    let history = useHistory();
    let headers = props.headers;
    let items = props.items;

    let headerRowContents = [];
    for (let i = 0; i < headers.length; ++i) {
        headerRowContents.push(<Col key={i}>{headers[i].display}</Col>);
    }

    let contentsRows = [];
    for (let i = 0; i < items.length; ++i) {
        let innerCols = [];

        for (let h = 0; h < headers.length; ++h) {
            let headerObj = headers[h];
            // items[i][headers[h].prop]

            innerCols.push(
                <Col key={h}>{headerObj.listDisplayFunc(items[i])}</Col>
            );
        }

        let pathRoute = `${props.pathRoot}/${items[i].Name}`;

        contentsRows.push(
            <li
                key={i}
                onClick={(e) => {
                    history.push(pathRoute);
                    e.preventDefault();
                }}
            >
                <Row>
                    {/* {items[i][headers[0].prop]} */}
                    {innerCols}
                </Row>
            </li>
        );
    }

    return (
        <>
            <Row>{headerRowContents}</Row>
            <ul className="element-list">{contentsRows}</ul>
        </>
    );
}
