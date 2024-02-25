import React from "react";
import { PiArrowFatUpBold } from "react-icons/pi";

const Toy = (props) => {
    const {
        number,
        activeDirection,
        toyColor,
        dataTestId
    } = props;
    let direction = {
        north: "rotate(0deg)",
        east: "rotate(90deg)",
        south: "rotate(180deg)",
        west: "rotate(270deg)",
    };
    return (
        <div style={{ marginTop: '15px' }} data-testid={dataTestId}>
            <PiArrowFatUpBold
                size={32}
                color={toyColor}
                style={{ transform: direction[activeDirection] }}
            />
            <p style={{ margin: 0 }}>
                Toy  {number + 1}
            </p>
        </div>
    );
};

export default Toy;
