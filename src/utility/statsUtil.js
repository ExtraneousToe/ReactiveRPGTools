import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function StatBlock(props) {
  let statBlock = props.statBlock;

  return (
    <>
      <Container className="text-center">
        <Row key="head" className="font-weight-bold">
          <Col>STR</Col>
          <Col>DEX</Col>
          <Col>CON</Col>
          <Col>INT</Col>
          <Col>WIS</Col>
          <Col>CHA</Col>
        </Row>
        <Row key="statVals">
          <Col key="str">
            {statBlock.str} ({getModifierDisplayString(statBlock.str)})
          </Col>
          <Col key="dex">
            {statBlock.dex} ({getModifierDisplayString(statBlock.dex)})
          </Col>
          <Col key="con">
            {statBlock.con} ({getModifierDisplayString(statBlock.con)})
          </Col>
          <Col key="int">
            {statBlock.int} ({getModifierDisplayString(statBlock.int)})
          </Col>
          <Col key="wis">
            {statBlock.wis} ({getModifierDisplayString(statBlock.wis)})
          </Col>
          <Col key="cha">
            {statBlock.cha} ({getModifierDisplayString(statBlock.cha)})
          </Col>
        </Row>
      </Container>
    </>
  );
}

export function getModifierDisplayString(stat) {
  let mod = getModifier(stat);

  if (mod > 0) mod = `+${mod}`;

  return mod;
}

export function getModifier(stat) {
  return Math.floor((stat - 10) / 2);
}
