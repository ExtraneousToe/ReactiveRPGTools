import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import { HarvestedItemFilterBlock } from "../components/HarvestedItemFilterBlock";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import Storage from "../utility/StorageUtil";
import {
    HarvestedItemDisplay,
    getItemReference,
} from "../utility/harvestedItemUtil";

export function HarvestedItems(props) {
    let [filterObj, setFilterObj] = useState({});

    const pathWithId = "/harvesteditems/:id";
    let harvestedItem = null;

    // extract monster id from the path
    let match = matchPath(props.location.pathname, { path: pathWithId });
    if (match !== null) {
        // if there is an id, search for the monster
        let id = match.params.id;
        if (Storage.harvestableItemDict[id] !== undefined) {
            harvestedItem = Storage.harvestableItemDict[id];
        }
    }

    const headers = [
        new DisplayColumn(
            "Name",
            (item) => {
                return <>{item["Name"]}</>;
            },
            (a, b) => {
                return sortStrAsc(a.Name, b.Name);
            }
        ),
    ];

    return (
        <>
            <Row className="h-100" xs={1} md={2}>
                <Col className="border h-100">
                    <HarvestedItemFilterBlock submitFilter={setFilterObj} />
                    <DisplayList
                        headers={headers}
                        items={Object.values(Storage.harvestableItemDict)}
                        filterObject={filterObj}
                        pathRoot={props.match.path}
                        idFunction={getItemReference}
                    />
                </Col>
                <Col className="border scrollableColumn">
                    {harvestedItem !== null && (
                        <HarvestedItemDisplay harvestedItem={harvestedItem} />
                    )}
                </Col>
            </Row>
        </>
    );
}
