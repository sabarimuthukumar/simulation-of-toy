import React, { useEffect, useState } from "react";
import Toy from "../components/Toy";
import toast from "react-hot-toast";

const TableTop = () => {
    let maxArraySize = 5;
    let tableArray = [...Array(maxArraySize)].map(() => Array(maxArraySize).fill(0));
    const [toys, setToys] = useState({
        toy1: {
            position: ["0", "0"],
            direction: "north",
            color: "darkred",
        },
    });
    const [newToy, setNewToy] = useState({
        position: ["0", "0"],
        direction: "",
        color: "",
    });
    const [samePosition, setSamePosition] = useState(false);
    const [willFallDown, setWillFallDown] = useState(false);
    const northBorder = ["50", "51", "52", "53", "54"];
    const eastBorder = ["45", "35", "25", "15", "05"];
    const westBorder = ["9", "19", "29", "39"];
    const toyColors = [
        "red",
        "blue",
        "green",
        "darkyellow",
        "pink",
        "purple",
        "darkred",
        "darkblue",
    ];
    const isPositionSame = (newToy) => {
        return Object.values(toys).some((val) => {
            const listVal = val.position.toString().replace(",", "");
            const newToyVal = newToy.position.toString().replace(",", "");
            return listVal === newToyVal;
        });
    };
    const addToy = () => {
        if (newToy.direction.length === 0) {
            toast.error("Select a Direction");
            return;
        }
        if (newToy.position[0] >= maxArraySize || newToy.position[1] >= maxArraySize) {
            toast.error(`Enter any number from 0 to ${maxArraySize - 1}`);
            return;
        }
        if (isPositionSame(newToy)) {
            setSamePosition(true);
        } else {
            setToys((prev) => {
                const length = Object.keys(prev).length + 1;
                const key = `toy${length}`;
                return { ...prev, [key]: newToy };
            });
        }
        const lot = Math.floor(Math.random() * 7);
        setNewToy({
            position: ["0", "0"],
            direction: "north",
            color: toyColors[lot],
        });
    };
    const updateNewToy = (event) => {
        if (event.target.name === "direction") {
            setNewToy((prev) => ({
                ...prev,
                direction: event.target.value,
            }));
        } else if (event.target.name === "row") {
            setNewToy((prev) => ({
                ...prev,
                position: [event.target.value, prev.position[1]],
            }));
        } else {
            setNewToy((prev) => ({
                ...prev,
                position: [prev.position[0], event.target.value],
            }));
        }
    };
    const updateToy = (toy, event, move) => {
        if (move) {
            if (isPositionSame({ position: event.split("") })) {
                setSamePosition(true);
            } else {
                setToys((prev) => ({
                    ...prev,
                    [toy]: {
                        direction: prev[toy].direction,
                        position: event.split(""),
                        color: prev[toy].color,
                    },
                }));
            }
        } else {
            setToys((prev) => ({
                ...prev,
                [toy]: {
                    position: prev[toy].position,
                    [event.target.name]: event.target.value,
                    color: prev[toy].color,
                },
            }));
        }
    };
    const moveToy = (toy) => {
        let currToy = toys[toy];
        setWillFallDown(false);
        setSamePosition(false);
        switch (currToy.direction) {
            case "north": {
                const currPosition = currToy.position.toString().replace(",", "");
                let newPosition = parseInt(currPosition) + 10;
                newPosition = `${newPosition}`;
                if (northBorder.includes(newPosition)) {
                    setWillFallDown(true);
                } else {
                    updateToy(toy, newPosition, true);
                }
                break;
            }
            case "south": {
                const currPosition = currToy.position.toString().replace(",", "");
                let newPosition = parseInt(currPosition) - 10;
                if (newPosition < 0) {
                    setWillFallDown(true);
                } else {
                    newPosition = `${newPosition}`;
                    updateToy(toy, newPosition, true);
                }
                break;
            }
            case "east": {
                const currPosition = currToy.position.toString().replace(",", "");
                let newPosition = parseInt(currPosition) + 1;
                newPosition = newPosition < 10 ? `0${newPosition}` : `${newPosition}`;
                if (eastBorder.includes(newPosition)) {
                    setWillFallDown(true);
                } else {
                    updateToy(toy, newPosition, true);
                }
                break;
            }
            case "west": {
                const currPosition = currToy.position.toString().replace(",", "");
                let newPosition = parseInt(currPosition) - 1;
                if (newPosition < 1 || westBorder.includes(newPosition)) {
                    setWillFallDown(true);
                } else {
                    newPosition = newPosition < 10 ? `0${newPosition}` : `${newPosition}`;
                    updateToy(toy, newPosition, true);
                }
                break;
            }
            default:
                console.error("invalid", currToy, currToy.direction);
        }
    };

    useEffect(() => {
        if (willFallDown) {
            toast.error("Toy will fall down");
        }
        if (samePosition) {
            toast.error("Some toy exists in this position");
        }
    }, [willFallDown, samePosition]);

    return (
        <div className="wrapper">
            <h2>Simulation of a toy robot moving on a square table top</h2>
            {tableArray.map((data, rIndex) => (
                <div key={rIndex} style={{ display: "flex", width: "500px" }}>
                    {data.map((_val, cIndex) => (
                        <div className="tile" key={cIndex} data-testid={`tile`}>
                            {Object.keys(toys).map((toy, index) => {
                                let currPosition = [`${4 - rIndex}`, `${cIndex}`];
                                let activPosition = toys[toy].position;
                                return (
                                    <div key={index}>
                                        {currPosition[0] === activPosition[0] &&
                                            currPosition[1] === activPosition[1] && (
                                                <Toy
                                                    key={index}
                                                    name={toy}
                                                    number={index}
                                                    activeDirection={toys[toy].direction}
                                                    toyColor={toys[toy].color}
                                                    dataTestId={`tile-${toy}-${activPosition[0]}${activPosition[1]}-${toys[toy].direction}`}
                                                />
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}
            <div className="controlsWrapper">
                <label htmlFor="input-row">Row:</label>
                <input
                    type="number"
                    name="row"
                    placeholder="Row Index"
                    value={newToy.position[0]}
                    onFocus={() => setSamePosition(false)}
                    onChange={(event) => updateNewToy(event)}
                    data-testid={"input-row"}
                />
                <label htmlFor="input-column">Column:</label>
                <input
                    type="number"
                    name="column"
                    placeholder="Column Index"
                    value={newToy.position[1]}
                    onFocus={() => setSamePosition(false)}
                    onChange={(event) => updateNewToy(event)}
                    data-testid={"input-column"}
                />
                <label htmlFor="select-direction">Direction:</label>
                <select
                    name="direction"
                    value={newToy.direction}
                    onChange={(event) => updateNewToy(event)}
                    data-testid={"select-direction"}
                >
                    <option disabled value={""} placeholder={"choose a direction"}></option>
                    <option value={"north"}>North</option>
                    <option value={"south"}>South</option>
                    <option value={"east"}>East</option>
                    <option value={"west"}>West</option>
                </select>

                <button onClick={() => addToy()}>Add Toy</button>
            </div>
            {Object.keys(toys).map((toy, index) => {
                const toyColor = toys[toy].color;
                const toyPosition = toys[toy].position.toString();
                const toyDirection =
                    toys[toy].direction.charAt(0).toUpperCase(0) +
                    toys[toy].direction.substring(1);
                const newLeftPosition = {
                    north: "west",
                    east: "north",
                    south: "east",
                    west: "south",
                };
                const newRightPosition = {
                    north: "east",
                    east: "south",
                    south: "west",
                    west: "north",
                };
                return (
                    <div key={toy} className="toyRow" style={index === 0 ? { marginTop: "30px" } : {}}>
                        <p style={{ color: toyColor }}>Toy  {index + 1}</p>
                        <p style={{ color: toyColor }}>
                            Position : {`(${toyPosition})`}
                        </p>
                        <p style={{ color: toyColor }}>Direction :{toyDirection}</p>

                        <div style={{ display: "flex" }}>
                            <p style={{ color: toyColor }}>Rotate :</p>
                            <select
                                name="direction"
                                value={toys[toy].direction}
                                onChange={(event) => updateToy(toy, event)}
                                style={{ color: toyColor }}
                                data-testid="select-rotate"
                            >
                                <option disabled default value={toys[toy].direction}>
                                </option>
                                <option value={newLeftPosition[toys[toy].direction]}>
                                    Left
                                </option>
                                <option value={newRightPosition[[toys[toy].direction]]}>
                                    Right
                                </option>
                            </select>
                        </div>
                        <button onClick={() => moveToy(toy)} data-testid="button-rotate">Move</button>
                    </div>
                );
            })}
        </div>
    );
};

export default TableTop;
