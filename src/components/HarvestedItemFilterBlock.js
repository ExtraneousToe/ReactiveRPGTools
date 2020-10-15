import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

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

export function HarvestedItemFilterBlock(props) {
    let [nameField, setNameField] = useState("");

    let filterRows = [];

    filterRows.push(
        BlockRow_Text(filterRows.length, "Name", nameField, setNameField)
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
