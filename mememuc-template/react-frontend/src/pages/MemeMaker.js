/**
 * References:
 * https://www.youtube.com/watch?v=rtQKP1we-Dk
 * https://stackoverflow.com/questions/43992427/how-to-display-a-image-selected-from-input-type-file-in-reactjs
 * https://gist.github.com/petehouston/85dd33210c0764eeae55
 * */

import React, {useEffect, useState} from "react";
import "../styles/mememaker.css"

const Meme = ({template, onClick}) => {
    return (
        <img
            className="row"
            src={template.url}
            alt={template.name}
            onClick={onClick}/>
    );
}

function MemeMaker() {

    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(null);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => setTemplates(response.data.memes))
        );
    }, []);

    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setTemplate(null);
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    function clear() {
        setTopText('');
        setBottomText('');
    }

    return (
        <div>
            <div className="template-area">
                {templates.map(template => {
                    return (<Meme key={template.id}
                                  template={template}
                                  onClick={() => {
                                      setImage(null);
                                      setTemplate(template);
                                  }}
                    />)
                })}
            </div>
            <div>
                <form onSubmit={async e => {
                    e.preventDefault();
                }}>
                    <div className="meme-area">
                        {template && <Meme template={template}/>}
                        {template && <p>{template.name}</p>}
                        {!template && image && <img className="row" src={image} alt={"image"}/>}

                        <div className="top-caption">{topText}</div>
                        <div className="bottom-caption">{bottomText}</div>
                    </div>


                    <br/>
                    <button>Upload a new template</button>
                    <input
                        placeholder="top text"
                        value={topText}
                        onChange={e => setTopText(e.target.value)}
                    />
                    <input
                        placeholder="bottom text"
                        value={bottomText}
                        onChange={e => setBottomText(e.target.value)}
                    />
                    <button type="submit">Create meme</button>
                </form>

                <button onClick={clear}>Clear</button>
                <input type="file" onChange={onImageChange}/>


            </div>

        </div>

    )
}

export default MemeMaker;