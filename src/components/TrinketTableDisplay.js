import React from "react";
import { Container, Row, Col } from "reactstrap";
import "../css/HamundsTables.css";

export function TrinketTableDisplay(props) {
  let trinketTable = props.trinketTable;

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
        <Col>{row.descriptionLine}</Col>
        <Col className="col-1">{row.value}</Col>
        <Col className="col-1">{row.weight}</Col>
      </Row>
    );
  }

  return (
    <Container className="hamund-table" fluid>
      {rowsOut}
    </Container>
  );
}
