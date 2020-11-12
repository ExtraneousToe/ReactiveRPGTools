import React from "react";
import { matchPath } from "react-router";
import { Col, Row } from "reactstrap";
import { sortAscending as sortStrAsc } from "../utility/stringUtil";
import HarvestedItemDisplay from "../components/HarvestedItemDisplay";

import { ModularDisplayList, MDColumn } from "../components/ModularDisplayList";
import { connect } from "react-redux";
import { getHarvestedItemDict } from "../redux/selectors";

const selectors = (store) => ({
  harvestedItemDict: getHarvestedItemDict(store),
});

export default connect(selectors)(HarvestedItems);

function HarvestedItems(props) {
  const pathWithId = "/harvesteditems/:id";
  let harvestedItem = null;

  // extract monster id from the path
  let match = matchPath(props.location.pathname, { path: pathWithId });
  let selectedId = "";
  if (match !== null) {
    // if there is an id, search for the monster
    selectedId = match.params.id;
    if (props.harvestedItemDict[selectedId] !== undefined) {
      harvestedItem = props.harvestedItemDict[selectedId];
    }
  }

  const headers = [
    new MDColumn(
      "Name",
      (item) => {
        return <>{item["name"]}</>;
      },
      (a, b) => {
        return sortStrAsc(a.name, b.name);
      }
    ),
  ];

  let harvestedOutput = ["Select an item from the list"];

  if (harvestedItem !== null) {
    harvestedOutput = [<HarvestedItemDisplay harvestedItem={harvestedItem} />];
  }

  return (
    <>
      <Row className="h-100" xs={1} md={2}>
        <Col className="border h-100">
          <ModularDisplayList
            headers={headers}
            items={Object.values(props.harvestedItemDict)}
            pathRoot={props.match.path}
            selectedId={selectedId}
            height={600}
            itemSize={25}
          />
        </Col>
        <Col className="border scrollableColumn">{harvestedOutput}</Col>
      </Row>
    </>
  );
}
