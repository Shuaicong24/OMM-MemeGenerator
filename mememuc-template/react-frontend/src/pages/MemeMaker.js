/**
 * References:
 * https://www.youtube.com/watch?v=rtQKP1we-Dk
 * */

import React, {useEffect, useState} from "react";
import "../styles/mememaker.css"

const Meme = ({ template, onClick }) => {
    return (
        <img
            className="row"
            src={template.url}
            alt={template.name}
            onClick={onClick}/>
);}

function MemeMaker() {

    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => setTemplates(response.data.memes))
        );
    }, []);
    return (
        <div>
            <div className="templateArea">
                {templates.map(template => {
                    return (<Meme key={template.id}
                        template={template}
                        onClick={() => {
                            setTemplate(template);
                        }}
                    />)
                })}
            </div>
            <div>
                <div className="memeArea">
                {template && <Meme template={template}/>}
                {template && <p>{template.name}</p>}
                 </div>
                <button>Upload a new template</button>

            </div>

        </div>

    )
}

export default MemeMaker;