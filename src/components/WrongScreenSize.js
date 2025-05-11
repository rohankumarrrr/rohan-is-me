import React, { useState } from "react";
import "./styles/Home.css";

const WrongScreenSize = () => {
    return (
        <div className="container">
            <h1 style={{fontFamily: "Lunar Escape", textAlign: 'center', padding: 0, paddingLeft: "3vh", paddingRight: "3vh"}}>
            This experience is best enjoyed on desktop devices.
            </h1>
        </div>
    );
}

export default WrongScreenSize;