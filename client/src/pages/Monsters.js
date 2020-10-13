import React from "react";
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

export function Monsters(props) {
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
                return <>{item["CreatureTypeRef"]}</>;
            },
            (a, b) => {
                return sortStrAsc(a.CreatureTypeRef, b.CreatureTypeRef);
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
                    {/* Filter field */}
                    <DisplayList
                        headers={headers}
                        items={Storage.monsterList}
                        pathRoot={props.match.path}
                        idFunction={getIdFromMonster}
                    />
                </Col>
                <Col className="col-7 border">
                    <MonsterDisplay monster={monster} />
                </Col>
            </Row>
            <div>Match: {JSON.stringify(match)}</div>
            <div>Props: {JSON.stringify(props)}</div>
            {/* <div>{JSON.stringify(monster)}</div> */}
        </Container>
    );
}
