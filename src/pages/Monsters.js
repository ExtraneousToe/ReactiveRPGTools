import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import Storage from "../utility/StorageUtil";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { ChallengeRating, CreatureType } from "../data/Monster";
import { MonsterDisplay } from "../components/MonsterDisplay";

import { CARD_SIZES } from "../data/referenceCardSizes";
import { MonsterFilterBlock } from "../components/MonsterFilterBlock";
import "./Columnable.css";
import "../LayoutControl/Layout.css";
import Sources from "../data/sources.json";

import { connect } from "react-redux";
import { getMonsterDict, getSubMonsterDict } from "../redux/selectors";

function Monsters(props) {
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
        return <>{item["type"].displayString}</>;
      },
      (a, b) => {
        return CreatureType.sortAscending(a.type, b.type);
      }
    ),
    new DisplayColumn(
      "CR",
      (item) => {
        return <>{item.challengeRating.displayString}</>;
      },
      (a, b) => {
        return ChallengeRating.sortAscending(
          a.challengeRating,
          b.challengeRating
        );
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
        return <span title={Sources[item["source"]]}>{item["source"]}</span>;
      },
      (a, b) => {
        return sortStrAsc(a.source, b.source);
      }
    ),
  ];

  //let list = Object.values(Storage.monsterDict);
  let list = Object.values(props.monsterDict);

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

const monstersSelector = (state) => ({
  monsterDict: getMonsterDict(state),
  subMonsterDict: getSubMonsterDict(state),
});

export default connect(monstersSelector)(Monsters);
