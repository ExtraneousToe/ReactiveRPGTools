import React, { useState } from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import { DisplayList, DisplayColumn } from "./DisplayList";
import MonsterDisplayList from "./MonsterDisplayList";
import Storage from "../utility/StorageUtil";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import { ChallengeRating, CreatureType } from "../data/Monster";
import MonsterDisplay from "../components/MonsterDisplay";

import { CARD_SIZES } from "../data/referenceCardSizes";
import { MonsterFilterBlock } from "../components/MonsterFilterBlock";
import "./Columnable.css";
import "../LayoutControl/Layout.css";
import Sources from "../data/sources.json";

import { connect } from "react-redux";
import { getMonsterDict, getSubMonsterDict } from "../redux/selectors";
import { selectMonster } from "../redux/actions";

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
    //props.selectMonster(selectedId);
    if (props.monsterDict[selectedId] !== undefined) {
      monster = props.monsterDict[selectedId];
    }
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          <MonsterFilterBlock submitFilter={setFilterObj} />
          <MonsterDisplayList
            filterObject={filterObj}
            pathRoot={props.match.path}
          />
        </Col>
        <Col className="border scrollableColumn">
          <MonsterDisplay monster={monster} />
        </Col>
      </Row>
    </>
  );
}

const monstersSelector = (state) => ({
  monsterDict: getMonsterDict(state),
  subMonsterDict: getSubMonsterDict(state),
});

export default connect(monstersSelector, (disp) => ({
  selectMonster: (monId) => disp(selectMonster(monId)),
}))(Monsters);
