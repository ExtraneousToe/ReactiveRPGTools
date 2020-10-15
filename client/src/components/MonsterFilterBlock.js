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
                        return <option value={opt}>{optLabels[opt]}</option>;
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
        BlockRow_Text(
            filterRows.length,
            "Creature Type",
            typeField,
            setTypeField
        )
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

    return (
        <form
            className="border"
            onSubmit={(e) => {
                let obj = {};
                if (nameField !== "") {
                    obj.Name = (obj) => {
                        return obj.Name.toLowerCase().match(
                            nameField.toLowerCase()
                        );
                    };
                }
                if (typeField !== "") {
                    obj.Type = (obj) => {
                        let crString = getCreatureTypeDisplayString(
                            obj.CreatureType
                        );
                        return crString
                            .toLowerCase()
                            .match(typeField.toLowerCase());
                    };
                }
                if (cardSizeField >= 0) {
                    obj.CardSize = (obj) => {
                        return obj.ReferenceCardSize == cardSizeField;
                    };
                }

                props.submitFilter(obj);
                e.preventDefault();
            }}
        >
            {filterRows}
            <button type="submit" style={{ display: "none" }}>
                Apply Filter
            </button>
        </form>
    );
}
