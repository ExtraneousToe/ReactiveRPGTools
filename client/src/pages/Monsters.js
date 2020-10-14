import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import { CRList } from "../components/ChallengeRatingDisplay";

import Storage from "../utility/StorageUtil";
import { getIdFromMonster } from "../utility/monsterUtil";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { sortAscending as sortCRAsc } from "../utility/challengeRatingUtil";
import { MonsterDisplay } from "../components/MonsterDisplay";

import { CARD_SIZES } from "../data/referenceCardSizes";
import {
    CreatureTypeList,
    sortCreatureTypeAsc,
} from "../utility/creatureTypeUtil";
import { FilterBlock } from "../components/FilterBlock";

export function Monsters(props) {
    let [filterObj, setFilterObj] = useState({});

    const pathWithId = "/monsters/:id";
    let monster = null;

    // extract monster id from the path
    let match = matchPath(props.location.pathname, { path: pathWithId });
    if (match !== null) {
        // if there is an id, search for the monster
        let id = match.params.id;
        if (Storage.monsterDict[id] !== undefined) {
            monster = Storage.monsterDict[id];
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
        new DisplayColumn(
            "Type",
            (item) => {
                return <CreatureTypeList creatureType={item["CreatureType"]} />;
            },
            (a, b) => {
                return sortCreatureTypeAsc(a.CreatureType, b.CreatureType);
            }
        ),
        new DisplayColumn(
            "CR",
            (item) => {
                return <CRList cr={item["ChallengeRating"]} />;
            },
            (a, b) => {
                return sortCRAsc(a.ChallengeRating, b.ChallengeRating);
            }
        ),
        new DisplayColumn(
            "Card Size",
            (item) => {
                return <>{CARD_SIZES[item["ReferenceCardSize"]]}</>;
            },
            (a, b) => {
                return a.ReferenceCardSize - b.ReferenceCardSize;
            }
        ),
    ];

    return (
        <Container fluid>
            <Row>
                <Col className="col-5 border">
                    <FilterBlock submitFilter={setFilterObj} />
                    <DisplayList
                        headers={headers}
                        items={Storage.monsterList}
                        filterObject={filterObj}
                        pathRoot={props.match.path}
                        idFunction={getIdFromMonster}
                    />
                </Col>
                <Col className="col-7 border">
                    <MonsterDisplay monster={monster} />
                </Col>
            </Row>
            {/* <div>Match: {JSON.stringify(match)}</div> */}
            {/* <div>Props: {JSON.stringify(props)}</div> */}
        </Container>
    );
}
