import React from "react";
import { Col, Row } from "reactstrap";
import { ModularDescription } from "../utility/descriptionUtil";
import { connect } from "react-redux";
import { getHarvestedItemDict, getCraftableItemDict } from "../redux/selectors";

const selector = (store) => ({
  craftableItemDict: getCraftableItemDict(store),
  harvestedItemDict: getHarvestedItemDict(store),
});

export default connect(selector)(CraftableItemDisplay);

function CraftableItemDisplay(props) {
  let craftableItem = props.craftableItem;

  let materialOutput = craftableItem.materials.map((mat, idx) => {
    let matItem = props.harvestedItemDict[mat.componentId];

    return (
      <span key={idx}>
        {matItem ? matItem.name : mat.componentId} ({mat.quantity})
      </span>
    );
  });
  let finalMaterialOutput = [];
  for (let i = 0; i < materialOutput.length; ++i) {
    if (finalMaterialOutput.length !== 0) {
      finalMaterialOutput.push(" " + craftableItem.materialGrouping + " ");
    }
    finalMaterialOutput.push(materialOutput[i]);
  }

  return (
    <>
      <Row>
        <Col className="font-weight-bold">{craftableItem.name}</Col>
      </Row>
      <Row>
        <Col>
          <i>
            {craftableItem.type},{" "}
            {(craftableItem.rarity !== null
              ? craftableItem.rarity
              : ""
            ).toLowerCase()}{" "}
            {craftableItem.requiresAttunement && "(requires attunement)"}
          </i>
        </Col>
      </Row>
      <Row>
        <Col>
          <i>
            Crafted by: {finalMaterialOutput} ({craftableItem.crafter})
          </i>
        </Col>
      </Row>
      &nbsp;
      <Row>
        <Col className="col-3 font-weight-bold">Description:</Col>
      </Row>
      <Row>
        <Col>
          {craftableItem.description.length > 0 &&
            craftableItem.description.map((para, idx) => {
              return <ModularDescription key={idx} description={para} />;
            })}
        </Col>
      </Row>
    </>
  );
}
