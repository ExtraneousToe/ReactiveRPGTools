import React from "react";
import { Container, Col, Row, Form } from "react-bootstrap";

export function getItemReferenceFromName(name) {
    return name.replace(/\s+/gi, "_").replace(/\//gi, "-").toLowerCase();
}

export function getItemReference(harvestedItem) {
    return harvestedItem.ReferenceId;
}

function simplePassthrough(val) {
    return val;
}

const ARRAY_CONC = ";;";
function joinArray(val) {
    return val.join(ARRAY_CONC);
}
function splitArray(val) {
    return val.split(ARRAY_CONC);
}

export class HarvestedItemDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.stringKeys = [
            {
                key: "ReferenceId",
                type: "text",
                retrieve: simplePassthrough,
                store: simplePassthrough,
            },
            {
                key: "Name",
                type: "text",
                retrieve: simplePassthrough,
                store: simplePassthrough,
            },
            {
                key: "ValueGP",
                type: "text",
                retrieve: simplePassthrough,
                store: simplePassthrough,
            },
            {
                key: "WeightLB",
                type: "text",
                retrieve: simplePassthrough,
                store: simplePassthrough,
            },
            {
                key: "CraftingUsage",
                type: "text",
                retrieve: joinArray,
                store: splitArray,
            },
            {
                key: "RequiredToolNames",
                type: "text",
                retrieve: joinArray,
                store: splitArray,
            },
            {
                key: "Description",
                type: "text",
                retrieve: joinArray,
                store: splitArray,
            },
            {
                key: "UseText",
                type: "text",
                retrieve: joinArray,
                store: splitArray,
            },
        ];

        this.state = this.generateStateObject(this.props.harvestedItem);

        this.applyStateToItem = this.applyStateToItem.bind(this);
    }

    generateStateObject(harvestedItem) {
        let obj = {};
        for (let i = 0; i < this.stringKeys.length; ++i) {
            let targetValue = harvestedItem[this.stringKeys[i].key];

            obj[this.stringKeys[i].key] = this.stringKeys[i].retrieve(
                targetValue
            );
        }
        return obj;
    }

    handleInput(event, key) {
        event.preventDefault();

        console.log(`${key}: ${event.target.value}`);

        let partialObject = {};
        partialObject[key] = event.target.value;
        this.setState(partialObject);
    }

    applyStateToItem(event) {
        event.preventDefault();
        console.log("applyStateToItem");

        for (let i = 0; i < this.stringKeys.length; ++i) {
            let targetValue = this.state[this.stringKeys[i].key];

            this.props.harvestedItem[this.stringKeys[i].key] = this.stringKeys[
                i
            ].store(targetValue);
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.harvestedItem.ReferenceId !==
            prevProps.harvestedItem.ReferenceId
        ) {
            this.setState(this.generateStateObject(this.props.harvestedItem));
        }
    }

    componentWillUnmount() {
        let partialObject = {};
        for (let i = 0; i < this.stringKeys.length; ++i) {
            partialObject[this.stringKeys[i]] = "";
        }
        this.setState(partialObject);
    }

    render() {
        let output = [];

        for (let i = 0; i < this.stringKeys.length; ++i) {
            let key = this.stringKeys[i];
            output.push(
                <Row key={output.length}>
                    <Col className="col-3 font-weight-bold">{key.key}: </Col>
                    <Col className="border">
                        <input
                            type={key.type}
                            value={this.state[key.key]}
                            style={{ width: "inherit" }}
                            onChange={(e) => {
                                e.preventDefault();
                                this.handleInput(e, key.key);
                            }}
                            disabled={key === "ReferenceId"}
                        />
                    </Col>
                </Row>
            );
        }

        return (
            <Container fluid>
                <Form onSubmit={this.applyStateToItem}>
                    {output}
                    {/* ReferenceId */}
                    {/* <Row>
                        <Col className="col-2 font-weight-bold">
                            ReferenceId:{" "}
                        </Col>
                        <Col className="border">
                            <input
                                type="text"
                                value={this.state["ReferenceId"]}
                                style={{ width: "inherit" }}
                                disabled
                            />
                        </Col>
                    </Row> */}
                    {/* Name */}
                    {/* <Row>
                        <Col className="col-2 font-weight-bold">Name: </Col>
                        <Col className="border">
                            <input
                                type="text"
                                value={this.state["Name"]}
                                style={{ width: "inherit" }}
                                onChange={(e) => {
                                    this.handleInput(e, "Name");
                                }}
                            />
                        </Col>
                    </Row> */}
                    {/* ValueGP */}
                    {/* <Row>
                        <Col className="col-2 font-weight-bold">ValueGP: </Col>
                        <Col className="border">
                            <input
                                type="text"
                                value={this.state["ValueGP"]}
                                style={{ width: "inherit" }}
                                onChange={(e) => {
                                    this.handleInput(e, "ValueGP");
                                }}
                            />
                        </Col>
                    </Row> */}
                    {/* WeightLB */}
                    {/* <Row>
                        <Col className="col-2 font-weight-bold">WeightLB: </Col>
                        <Col className="border">
                            <input
                                type="text"
                                value={this.state["WeightLB"]}
                                style={{ width: "inherit" }}
                                onChange={(e) => {
                                    this.handleInput(e, "WeightLB");
                                }}
                            />
                        </Col>
                    </Row> */}
                    <input type="submit" value="Apply Changes" />
                </Form>
            </Container>
        );
    }
}
