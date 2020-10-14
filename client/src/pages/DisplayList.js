import React, { useState } from "react";
import { useHistory } from "react-router";
import { Row, Col } from "reactstrap";
import "./DisplayList.css";

export class DisplayColumn {
    constructor(colDisplay, listDisplayFunc, ascendingSortFunction) {
        this.colDisplay = colDisplay;
        this.listDisplayFunc = listDisplayFunc;
        this.ascendingSortFunction = ascendingSortFunction;

        this.sortFunc = this.sortFunc.bind(this);
        this.sortAscending = this.sortAscending.bind(this);
        this.sortDescending = this.sortDescending.bind(this);
    }

    sortFunc(isAscending) {
        return isAscending ? this.sortAscending : this.sortDescending;
    }

    sortAscending(a, b) {
        return this.ascendingSortFunction(a, b);
    }

    sortDescending(a, b) {
        return -this.ascendingSortFunction(a, b);
    }
}

export function DisplayList(props) {
    let history = useHistory();

    // headers should be a collection of DisplayColumn instances
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
                className={`list-header ${i === sortByIdx && "active"}`}
            >
                {headers[i].colDisplay}{" "}
                {i === sortByIdx && <>{sortAscending ? "^" : "v"}</>}
            </Col>
        );
    }

    let filterObject = props.filterObject;
    let filterKeys = Object.keys(filterObject);

    for (let i = 0; i < filterKeys.length; ++i) {
        // let keyValue = filterObject[filterKeys[i]]; //.toLowerCase();
        // if (keyValue === "" || keyValue === null) {
        //     continue;
        // }

        items = items.filter(filterObject[filterKeys[i]]);
        //     (item) => {
        //         return (item);
        //     }
        //     // return item[filterKeys[i]].toLowerCase().match(keyValue);
        // );
    }

    items.sort(headers[sortByIdx].sortFunc(sortAscending));

    let contentsRows = [];
    for (let i = 0; i < items.length; ++i) {
        let innerCols = [];

        for (let h = 0; h < headers.length; ++h) {
            let headerObj = headers[h];

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
                <Row>{innerCols}</Row>
            </li>
        );
    }

    return (
        <>
            <Row className="mx-0">{headerRowContents}</Row>
            <ul className="element-list">{contentsRows}</ul>
        </>
    );
}
