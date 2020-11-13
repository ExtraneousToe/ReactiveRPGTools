import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Container, Row, Col } from "reactstrap";
import "../css/HamundsTables.css";
import {
  RollableSpan,
  rollableTokenisedLine,
  stripTags,
  tokeniseByTags,
} from "../utility/stringUtil";

export default withRouter(TrinketTableDisplay);

function TrinketTableDisplay(props) {
  const { location } = props;
  let [rolledArray, setRolledArray] = useState([]);
  let trinketTable = props.trinketTable;

  // if (!location.pathname.includes(props.monsterId)) {
  //   setRolledArray([]);
  // }

  useEffect(() => {
    setRolledArray([]);
  }, [props.monsterId]);

  if (trinketTable === null || trinketTable === undefined) {
    return <></>;
  }

  let rowsOut = [];

  rowsOut.push(
    <Row className="text-center font-weight-bold" key={"trinketTableHeader"}>
      <Col className="col-1">D8</Col>
      <Col className="text-left">Description</Col>
      <Col className="col-1">Value</Col>
      <Col className="col-1">Weight</Col>
    </Row>
  );

  for (let i = 0; i < trinketTable.rows.length; ++i) {
    let row = trinketTable.rows[i];
    rowsOut.push(
      <Row key={`tt-r${i}`}>
        <Col className="col-1 text-center">{row.d8Roll}</Col>
        <Col>
          {stripTags(row.descriptionLine)}
          {/* <span
            dangerouslySetInnerHTML={{
              __html: stripTags(row.descriptionLine),
            }}
          /> */}
        </Col>
        <Col className="col-1">{row.value}</Col>
        <Col className="col-1">{row.weight}</Col>
      </Row>
    );
  }

  return (
    <Container className="hamund-table" fluid>
      {rowsOut}
      <div className="border" />
      <Row>
        <button
          onClick={() => {
            let rolled = trinketTable.roll();
            let row = rolled.row;

            let arrayCopy = rolledArray.slice();

            arrayCopy.unshift(
              <Row
                key={`tt-r-rolled-${rolled.result}-${trinketTable.id}-${arrayCopy.length}`}
              >
                <Col className="col-1 text-center">{row.d8Roll}</Col>
                <Col>{rollableTokenisedLine(row.descriptionLine)}</Col>
                <Col className="col-1">{row.value}</Col>
                <Col className="col-1">{row.weight}</Col>
              </Row>
            );

            setRolledArray(arrayCopy);

            console.log(JSON.stringify(arrayCopy));
          }}
        >
          Roll
        </button>
        <button onClick={() => setRolledArray([])}>Clear history</button>
      </Row>
      <Row style={{ overflowY: "hidden", height: "200px" }}>
        <Col>{rolledArray}</Col>
      </Row>
    </Container>
  );
}
