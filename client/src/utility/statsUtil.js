import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export function StatBlock(props) {
    let statBlock = props.statBlock;

    return (
        <>
            <Container className="text-center">
                <Row className="font-weight-bold">
                    <Col>STR</Col>
                    <Col>DEX</Col>
                    <Col>CON</Col>
                    <Col>INT</Col>
                    <Col>WIS</Col>
                    <Col>CHA</Col>
                </Row>
                <Row>
                    <Col>
                        {statBlock.Strength} (
                        {getModifierDisplayString(statBlock.Strength)})
                    </Col>
                    <Col>
                        {statBlock.Dexterity} (
                        {getModifierDisplayString(statBlock.Dexterity)})
                    </Col>
                    <Col>
                        {statBlock.Constitution} (
                        {getModifierDisplayString(statBlock.Constitution)})
                    </Col>
                    <Col>
                        {statBlock.Intelligence} (
                        {getModifierDisplayString(statBlock.Intelligence)})
                    </Col>
                    <Col>
                        {statBlock.Wisdom} (
                        {getModifierDisplayString(statBlock.Wisdom)})
                    </Col>
                    <Col>
                        {statBlock.Charisma} (
                        {getModifierDisplayString(statBlock.Charisma)})
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
