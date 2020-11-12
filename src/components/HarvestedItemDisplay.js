import React from "react";
import { Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { getCraftableItemDict } from "../redux/selectors";

const selectors = (store) => ({
  craftableItemDict: getCraftableItemDict(store),
});

export default connect(selectors)(HarvestedItemDisplay);

function HarvestedItemDisplay(props) {
  let hItem = props.harvestedItem;

  return (
    <>
      <Row>
        <Col className="col-3 font-weight-bold">Name:</Col>
        <Col>{hItem.name}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Value:</Col>
        <Col>{hItem.value}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Weight:</Col>
        <Col>{hItem.weight}</Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Required Tools:</Col>
        <Col>
          {hItem.requiredToolNames.length === 0
            ? "-"
            : hItem.requiredToolNames.join(" and ")}
        </Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">CraftingUsage:</Col>
        <Col>
          {hItem.craftingUsage.length === 0
            ? "-"
            : hItem.craftingUsage
                .map((cu) => props.craftableItemDict[cu].name)
                .join(" and ")}
        </Col>
      </Row>
      <Row>
        <Col className="col-3 font-weight-bold">Description:</Col>
        <Col>
          {hItem.description.map((para, idx) => {
            return <p key={idx}>{para}</p>;
          })}
        </Col>
      </Row>
      {hItem.useText.length !== 0 && (
        <Row>
          <Col className="col-3 font-weight-bold">UseText:</Col>
          <Col>
            {hItem.useText.map((para, idx) => {
              return <p key={idx}>{para}</p>;
            })}
          </Col>
        </Row>
      )}
    </>
  );
}
