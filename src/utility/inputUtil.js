import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

export function ArrayInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;

    // const onChangeFunc = (e) => {
    //     propObj[propKey] = e.target.value;
    //     setRedraw(!redraw);
    // };

    const addLine = (e) => {
        propObj[propKey].push("");
        setRedraw(!redraw);
    };

    const removeLine = (e, idx) => {
        propObj[propKey].splice(idx, 1);
        setRedraw(!redraw);
    };

    let arrayLines = [];
    for (let i = 0; i < propObj[propKey].length; ++i) {
        arrayLines.push(
            <Row key={i}>
                <Col className="col-1">
                    <button
                        onClick={(e) => {
                            removeLine(e, i);
                        }}
                    >
                        -
                    </button>
                </Col>
                <Col>
                    <props.subType
                        object={propObj}
                        objKey={propKey}
                        index={i}
                    />
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Row>
                <Col className="col-3">{propKey}: </Col> <Col></Col>
            </Row>
            {arrayLines}
            <button onClick={addLine}>+</button>
        </>
    );
}

export function SelectInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;

    const onChangeFunc = (e) => {
        propObj[propKey] = e.target.value;
        setRedraw(!redraw);
    };

    let options = props.options.map((opt, idx) => {
        return (
            <option value={opt} key={idx}>
                {opt}
            </option>
        );
    });

    return (
        <>
            <Row>
                <Col className="col-3">{propKey}: </Col>{" "}
                <Col>
                    <select
                        style={{ width: "inherit" }}
                        value={propObj[propKey]}
                        onChange={onChangeFunc}
                    >
                        {options}
                    </select>
                </Col>
            </Row>
        </>
    );
}

export function StringInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;
    let propIdx = props.index;

    const onChangeFunc = (e) => {
        if (propIdx !== undefined) {
            propObj[propKey][propIdx] = e.target.value;
        } else {
            propObj[propKey] = e.target.value;
        }
        setRedraw(!redraw);
    };

    let value = propObj[propKey];
    if (propIdx !== undefined) {
        // value = JSON.stringify(propObj[propKey]); //[propIdx];
        value = propObj[propKey][propIdx];
    }

    return (
        <>
            <Row>
                <Col className="col-3">{propKey}: </Col>{" "}
                <Col>
                    <input
                        type="text"
                        style={{ width: "inherit" }}
                        value={value}
                        onChange={onChangeFunc}
                    />
                </Col>
            </Row>
        </>
    );
}

export function CheckboxInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;

    const onChangeFunc = (e) => {
        propObj[propKey] = e.target.checked;
        setRedraw(!redraw);
    };

    let checked = "";
    if (propObj[propKey]) checked = "checked";

    return (
        <>
            <Row>
                <Col className="col-3">{propKey}: </Col>{" "}
                <Col>
                    <input
                        type="checkbox"
                        style={{ width: "inherit" }}
                        onChange={onChangeFunc}
                        checked={propObj[propKey] ? "checked" : ""}
                    />
                </Col>
            </Row>
        </>
    );
}
