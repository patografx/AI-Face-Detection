import React from 'react';
import Tilt from 'react-parallax-tilt';
import logo from "./logo.png";
import "./Logo.css";

const Logo = () => {

    return (
        <div className="tilt ma4 mt0 w-10">
            <Tilt scale={1.5} tiltReverse> 
                <div className="">
                    <img alt="logo" src={logo} className='logo pt1'/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;