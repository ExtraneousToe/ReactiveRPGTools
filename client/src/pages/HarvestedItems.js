import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Container, Row } from "react-bootstrap";
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
        <Container fluid>
            <Row>
                <Col className="col-5 border">
                    <HarvestedItemFilterBlock submitFilter={setFilterObj} />
                    <DisplayList
                        headers={headers}
                        items={Object.values(Storage.harvestableItemDict)}
                        filterObject={filterObj}
                        pathRoot={props.match.path}
                        idFunction={getItemReference}
                    />
                </Col>
                <Col className="col-7 border">
                    {harvestedItem !== null && (
                        <HarvestedItemDisplay harvestedItem={harvestedItem} />
                    )}
                </Col>
            </Row>
        </Container>
    );
}
