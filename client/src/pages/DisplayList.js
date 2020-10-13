import React, { useState } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "reactstrap";
import "./DisplayList.css";

export function DisplayList(props) {
    let history = useHistory();
    let headers = props.headers;
    let items = props.items;

    let [sortByIdx, setSortByIdx] = useState(0);
    let [sortAscending, setSortAscending] = useState(true);

    let headerRowContents = [];
    for (let i = 0; i < headers.length; ++i) {
        headerRowContents.push(
            <Col
                key={i}
                onClick={(e) => {
                    e.preventDefault();

                    if (i === sortByIdx) {
                        setSortAscending(!sortAscending);
                    } else {
                        setSortByIdx(i);
                        setSortAscending(true);
                    }
                }}
            >
                {headers[i].display}{" "}
                {i === sortByIdx && <>{sortAscending ? "^" : "v"}</>}
            </Col>
        );
    }

    let sortProperty = headers[sortByIdx].prop;
    console.log(`${sortProperty} ${sortAscending}`);

    // let sortType = typeof items[0][sortProperty];
    // let ascMod = sortAscending ? 1 : -1;
    // switch (sortType) {
    //     case "string":
    //         items.sort((a, b) => {
    //             let x = a[sortProperty].toLowerCase();
    //             let y = b[sortProperty].toLowerCase();

    //             if (y < x) {
    //                 return ascMod;
    //             }
    //             if (x < y) {
    //                 return -ascMod;
    //             }
    //             return 0;
    //         });
    //         break;
    //     case "number":
    //         items.sort((a, b) => {
    //             return (a[sortProperty] - b[sortProperty]) * ascMod;
    //         });
    //         break;
    //     case "object":
    //         break;
    //     default:
    //         console.log(`Sorting on property type: ${sortType}`);
    // }

    items.sort(
        sortAscending
            ? headers[sortByIdx].sortingFunctionAsc
            : headers[sortByIdx].sortingFunctionDesc
    );

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

        let pathRoute = `${props.pathRoot}/${props.idFunction(items[i])}`;

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
