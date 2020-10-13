import React from "react";
import { matchPath } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { DisplayList } from "./DisplayList";
import { CRList } from "../components/ChallengeRatingDisplay";

import Data from "../data/system-state.json";
import { MonsterDisplay } from "../components/MonsterDisplay";

import { CARD_SIZES } from "../data/referenceCardSizes";

export function Monsters(props) {
    const pathWithId = "/monsters/:id";
    let monster = null;

    // extract monster id from the path
    let match = matchPath(props.location.pathname, { path: pathWithId });
    if (match !== null) {
        // if there is an id, search for the monster
        monster = Data.Monsters.filter(
            (obj) => obj.Name === match.params.id
        )[0];
        // monster = match.params.id;
    }

    const headers = [
        {
            display: "Name",
            prop: "Name",
            listDisplayFunc: (item) => {
                return <>{item["Name"]}</>;
            },
        },
        {
            display: "Type",
            prop: "CreatureTypeRef",
            listDisplayFunc: (item) => {
                return <>{item["CreatureTypeRef"]}</>;
            },
        },
        {
            display: "CR",
            prop: "ChallengeRating",
            listDisplayFunc: (item) => {
                let cr = item["ChallengeRating"];

                return <CRList cr={cr} />;
            },
        },
        {
            display: "Card Size",
            prop: "ReferenceCardSize",
            listDisplayFunc: (item) => {
                /*
                 public enum ECardSize
                {
                    None,
                    Small,
                    Medium,
                    Large
                }
                */
                return <>{CARD_SIZES[item["ReferenceCardSize"]]}</>;
            },
        },
    ];

    return (
        <Container fluid>
            <Row>
                <Col className="col-5 border">
                    {/* Filter field */}
                    <DisplayList
                        headers={headers}
                        items={Data.Monsters}
                        pathRoot={props.match.path}
                    />
                </Col>
                <Col className="col-7 border">
                    <MonsterDisplay monster={monster} />
                </Col>
            </Row>
            <div>{JSON.stringify(match)}</div>
            <div>{JSON.stringify(props)}</div>
            <div>{JSON.stringify(monster)}</div>
        </Container>
    );
}
