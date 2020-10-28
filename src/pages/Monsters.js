import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import { CRList } from "../components/ChallengeRatingDisplay";
import Storage from "../utility/StorageUtil";
// import { getIdFromMonster } from "../utility/monsterUtil";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { sortAscending as sortCRAsc } from "../utility/challengeRatingUtil";
import { MonsterDisplay } from "../components/MonsterDisplay";

import { CARD_SIZES } from "../data/referenceCardSizes";
import {
  CreatureTypeList,
  sortCreatureTypeAsc,
} from "../utility/creatureTypeUtil";
import { MonsterFilterBlock } from "../components/MonsterFilterBlock";
import "./Columnable.css";
import "../LayoutControl/Layout.css";

export function Monsters(props) {
  let [filterObj, setFilterObj] = useState({});

  const pathWithId = "/monsters/:id";
  let monster = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (Storage.monsterDict[selectedId] !== undefined) {
      monster = Storage.monsterDict[selectedId];
    }
  }

  const headers = [
    new DisplayColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
    new DisplayColumn(
      "Type",
      (item) => {
        return <CreatureTypeList creatureType={item["type"]} />;
      },
      (a, b) => {
        return sortCreatureTypeAsc(a.creatureType, b.creatureType);
      }
    ),
    new DisplayColumn(
      "CR",
      (item) => {
        return <CRList cr={item["challengeRating"]} />;
      },
      (a, b) => {
        return sortCRAsc(a.challengeRating, b.challengeRating);
      }
    ),
    new DisplayColumn(
      "Card Size",
      (item) => {
        var subMon = Storage.subStateMonsterDict[item.id];
        return <>{subMon ? CARD_SIZES[subMon.cardSize] : "-"}</>;
      },
      (a, b) => {
        var subMonA = Storage.subStateMonsterDict[a.id];
        var subMonB = Storage.subStateMonsterDict[b.id];

        if (subMonA && subMonB) {
          return subMonA.cardSize - subMonB.cardSize;
        } else if (subMonA && !subMonB) {
          return -1;
        } else if (!subMonA && subMonB) {
          return 1;
        } else {
          // TODO: Fix this
          return -1;
        }
      }
    ),
    new DisplayColumn(
      "Source",
      (item) => {
        return <>{item["source"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.source, b.source);
      }
    ),
  ];

  let list = Object.values(Storage.monsterDict);

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          <MonsterFilterBlock submitFilter={setFilterObj} />
          <DisplayList
            headers={headers}
            items={list}
            filterObject={filterObj}
            pathRoot={props.match.path}
            idFunction={(mon) => mon.id}
            selectedId={selectedId}
          />
        </Col>
        <Col className="border scrollableColumn">
          <MonsterDisplay monster={monster} selectedId={selectedId} />
        </Col>
      </Row>
    </>
  );
}
