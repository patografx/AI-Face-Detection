import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onSubmit }) => {

    return (
        <div>
            <p className="f3">
                {'This SmartBrain is detecting faces in your images.'}
            </p>

            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input
                        className="f4 pa2 w-70 center"
                        type='text'
                        onChange={onInputChange}
                    />
                    <button
                        className="w-30 br1 f4 link bn ph3 pv2 dib white bg-blue"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ImageLinkForm;