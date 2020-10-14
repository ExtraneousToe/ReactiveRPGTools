import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./hamundsTables.css";

export function TrinketTableDisplay(props) {
    let trinketTable = props.trinketTable;

    if (trinketTable === null || trinketTable === undefined) {
        return <></>;
    }

    let rowsOut = [];

    rowsOut.push(
        <Row className="text-center font-weight-bold" key={-1}>
            <Col className="col-1">D8</Col>
            <Col className="text-left">Description</Col>
            <Col className="col-1">Value</Col>
            <Col className="col-1">Weight</Col>
        </Row>
    );

    for (let i = 0; i < trinketTable.Rows.length; ++i) {
        let row = trinketTable.Rows[i];
        rowsOut.push(
            <Row key={i}>
                <Col className="col-1 text-center">{row.D8Roll}</Col>
                <Col>{row.DescriptionLine}</Col>
                <Col className="col-1">{row.ValueGP}</Col>
                <Col className="col-1">{row.WeightLB}</Col>
            </Row>
        );
    }

    return <Container className="hamund-table">{rowsOut}</Container>;
}
