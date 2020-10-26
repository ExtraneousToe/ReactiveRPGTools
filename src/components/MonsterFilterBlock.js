import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getCreatureTypeDisplayString } from "../utility/creatureTypeUtil";
import { CARD_SIZES } from "../data/referenceCardSizes";

function BlockRow_Text(key, label, value, setter) {
  return (
    <Row key={key}>
      <Col className="col-3">{label}:</Col>
      <Col>
        <input
          type="text"
          value={value}
          style={{
            width: "inherit",
          }}
          onChange={(e) => {
            e.preventDefault();
            setter(e.target.value);
          }}
        />
      </Col>
    </Row>
  );
}

function BlockRow_Select(key, label, value, setter, selectOpts, optLabels) {
  return (
    <Row key={key}>
      <Col className="col-3">{label}:</Col>
      <Col>
        <select
          value={value}
          style={{
            width: "inherit",
          }}
          onChange={(e) => {
            e.preventDefault();
            setter(e.target.value);
          }}
        >
          <option value={null}>Ignore</option>
          {selectOpts.map((opt, idx) => {
            return (
              <option key={idx} value={opt}>
                {optLabels[opt]}
              </option>
            );
          })}
        </select>
      </Col>
    </Row>
  );
}

export function MonsterFilterBlock(props) {
  let [nameField, setNameField] = useState("");
  let [typeField, setTypeField] = useState("");
  let [cardSizeField, setCardSizeField] = useState();

  let filterRows = [];

  filterRows.push(
    BlockRow_Text(filterRows.length, "Name", nameField, setNameField)
  );
  filterRows.push(
    BlockRow_Text(filterRows.length, "Creature Type", typeField, setTypeField)
  );
  filterRows.push(
    BlockRow_Select(
      filterRows.length,
      "Card Size",
      cardSizeField,
      setCardSizeField,
      [0, 1, 2, 3],
      CARD_SIZES
    )
  );

  // TODO: add option to filter by having (or not) harvesting/trinket tables

  const submitFunc = (e) => {
    let obj = {};
    if (nameField !== "") {
      obj.Name = (obj) => {
        return obj.name.toLowerCase().match(nameField.toLowerCase());
      };
    }
    if (typeField !== "") {
      obj.Type = (obj) => {
        let crString = getCreatureTypeDisplayString(obj.type);
        return crString.toLowerCase().match(typeField.toLowerCase());
      };
    }
    if (cardSizeField >= 0) {
      obj.CardSize = (obj) => {
        return obj.ReferenceCardSize === Number(cardSizeField);
      };
    }

    props.submitFilter(obj);
    e.preventDefault();
  };

  return (
    <form id="filter" className="border" onSubmit={submitFunc}>
      {filterRows}
      <button type="submit">Apply Filter</button>
    </form>
  );
}
