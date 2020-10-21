import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

export function ArrayInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;

    const addLine = (e) => {
        propObj[propKey].push("");
        setRedraw(!redraw);
    };
    const insertLine = (e, tarIndex) => {
        propObj[propKey].splice(tarIndex, 0, "");
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
                <Col className="col-2 border">
                    <button
                        onClick={(e) => {
                            insertLine(e, i);
                        }}
                        // disabled={i === 0}
                    >
                        ^
                    </button>
                    <button
                        onClick={(e) => {
                            removeLine(e, i);
                        }}
                    >
                        -
                    </button>
                    <button
                        onClick={(e) => {
                            insertLine(e, i + 1);
                        }}
                        // disabled={i === propObj[propKey].length - 1}
                    >
                        v
                    </button>
                </Col>
                <Col>
                    <props.subType
                        object={propObj}
                        objKey={propKey}
                        index={i}
                        hideLabel={true}
                    />
                </Col>
            </Row>
        );
    }

    return (
        <>
            <Row>
                <Col className="col-3">
                    {propKey}: <button onClick={addLine}>+</button>
                </Col>
            </Row>

            {arrayLines}
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

export function RadioButtonInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;

    const onChangeFunc = (e) => {
        if (e.target.checked) {
            propObj[propKey] = e.target.value;
            setRedraw(!redraw);
        }
    };

    let options = props.options.map((opt, idx) => {
        return (
            <div>
                <input
                    type="radio"
                    value={opt}
                    key={idx}
                    name={propKey}
                    id={opt}
                    checked={propObj[propKey] === opt}
                    onChange={onChangeFunc}
                />{" "}
                <label for={opt}>{opt}</label>
            </div>
        );
    });

    return (
        <>
            <Row className="border">
                <Col className="col-3">{propKey}: </Col> <Col>{options}</Col>
            </Row>
        </>
    );
}

export function StringInput(props) {
    let [redraw, setRedraw] = useState(true);
    let propObj = props.object;
    let propKey = props.objKey;
    let propIdx = props.index;

    let { disabled, hideLabel, ...otherProps } = props;

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
        value = propObj[propKey][propIdx];
    }

    return (
        <>
            <Row>
                {!hideLabel && <Col className="col-3">{propKey}: </Col>}
                <Col>
                    <input
                        type="text"
                        style={{ width: "inherit" }}
                        value={value}
                        onChange={onChangeFunc}
                        disabled={disabled}
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
