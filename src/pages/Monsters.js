import "../css/Columnable.css";
import "../css/Layout.css";

import React from "react";
import { matchPath } from "react-router";
import { Col, Row } from "react-bootstrap";
import MonsterDisplayList from "../components/MonsterDisplayList";
import MonsterDisplay from "../components/MonsterDisplay";

import { connect } from "react-redux";
import { getMonsterDict, getSubMonsterDict } from "../redux/selectors";

const monstersSelector = (state) => ({
  monsterDict: getMonsterDict(state),
  subMonsterDict: getSubMonsterDict(state),
});

export default connect(monstersSelector)(Monsters);

function Monsters(props) {
  const pathWithId = "/monsters/:id";
  let monster = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (props.monsterDict[selectedId] !== undefined) {
      monster = props.monsterDict[selectedId];
    }
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          {/* <MonsterFilterBlock submitFilter={setFilterObj} /> */}
          <MonsterDisplayList
            // filterObject={filterObj}
            pathRoot={props.match.path}
            selectedId={selectedId}
          />
        </Col>
        <Col className="border">
          <MonsterDisplay monster={monster} />
        </Col>
      </Row>
    </>
  );
}
