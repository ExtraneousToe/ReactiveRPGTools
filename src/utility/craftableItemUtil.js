import React, { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import {
    StringInput,
    CheckboxInput,
    SelectInput,
    ArrayInput,
} from "./inputUtil";

export function getIdFromItemName(name) {
    return name.toLowerCase().replace(/\s+/g, "_");
}

export function getIdFromItem(item) {
    if (item.Id !== undefined) return item.Id;
    else return getIdFromItemName(item.Name);
}

export function CraftableItemDisplay(props) {
    let craftableItem = props.craftableItem;
    return <>{JSON.stringify(craftableItem)}</>;
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

export class EditingCraftableItemDisplay extends React.Component {
    constructor(props) {
        super(props);

        // this.stringKeys = [
        //     {
        //         key: "Id",
        //         type: "text",
        //         retrieve: simplePassthrough,
        //         store: simplePassthrough,
        //     },
        //     {
        //         key: "Name",
        //         type: "text",
        //         retrieve: simplePassthrough,
        //         store: simplePassthrough,
        //     },
        //     {
        //         key: "Crafter",
        //         type: "text",
        //         retrieve: simplePassthrough,
        //         store: simplePassthrough,
        //     },
        //     {
        //         key: "Rarity",
        //         type: "text",
        //         retrieve: simplePassthrough,
        //         store: simplePassthrough,
        //     },
        //     {
        //         key: "Description",
        //         type: "text",
        //         retrieve: joinArray,
        //         store: splitArray,
        //     },
        // ];

        this.state = this.generateStateObject(this.props.craftableItem);
        this.applyStateToItem = this.applyStateToItem.bind(this);
    }

    generateStateObject(craftableItem) {
        let obj = {};
        // for (let i = 0; i < this.stringKeys.length; ++i) {
        //     let targetValue = craftableItem[this.stringKeys[i].key];

        //     obj[this.stringKeys[i].key] = this.stringKeys[i].retrieve(
        //         targetValue
        //     );
        // }
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

        for (let i = 0; i < this.stringKeys.length; ++i) {
            let targetValue = this.state[this.stringKeys[i].key];

            this.props.craftableItem[this.stringKeys[i].key] = this.stringKeys[
                i
            ].store(targetValue);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.craftableItem.Id !== prevProps.craftableItem.Id) {
            this.setState(this.generateStateObject(this.props.craftableItem));
        }
    }

    componentWillUnmount() {
        let partialObject = {};
        // for (let i = 0; i < this.stringKeys.length; ++i) {
        //     partialObject[this.stringKeys[i]] = "";
        // }
        this.setState(partialObject);
    }

    render() {
        let craftableItem = this.props.craftableItem;

        let output = [];
        // for (let i = 0; i < this.stringKeys.length; ++i) {
        //     let key = this.stringKeys[i];
        //     let value = "";
        //     if (this.state[key.key] !== null) {
        //         value = this.state[key.key];
        //     }

        //     output.push(
        //         <Row key={output.length}>
        //             <Col className="col-3 font-weight-bold">{key.key}: </Col>
        //             <Col className="border">
        //                 <input
        //                     type={key.type}
        //                     value={value}
        //                     style={{ width: "inherit" }}
        //                     onChange={(e) => {
        //                         e.preventDefault();
        //                         this.handleInput(e, key.key);
        //                     }}
        //                     disabled={key.key === "Id"}
        //                 />
        //             </Col>
        //         </Row>
        //     );
        // }

        // return <>{JSON.stringify(craftableItem)}</>;

        return (
            <Container fluid>
                {/* <div>propObj :: {JSON.stringify(craftableItem)}</div> */}
                <StringInput object={craftableItem} objKey="Id" disabled />
                <StringInput object={craftableItem} objKey="Name" />
                <SelectInput
                    object={craftableItem}
                    objKey="Crafter"
                    options={[
                        "Alchemist",
                        "Artificer",
                        "Blacksmith",
                        "Leatherworker",
                        "Tinker",
                        "Thaumaturge",
                    ]}
                />
                <SelectInput
                    object={craftableItem}
                    objKey="Rarity"
                    options={[
                        "Common",
                        "Uncommon",
                        "Rare",
                        "Very Rare",
                        "Legendary",
                    ]}
                />
                <CheckboxInput
                    object={craftableItem}
                    objKey="RequiresAttunement"
                />
                <ArrayInput
                    object={craftableItem}
                    objKey="Description"
                    subType={StringInput}
                />
                <ArrayInput
                    object={craftableItem}
                    objKey="Materials"
                    subType={MaterialInput}
                />
            </Container>
        );
    }
}

function MaterialInput(props) {
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

    return (
        <>
            <StringInput
                object={propObj[propKey][propIdx]}
                objKey="ComponentId"
            />
            <StringInput object={propObj[propKey][propIdx]} objKey="Quantity" />
        </>
    );
}
