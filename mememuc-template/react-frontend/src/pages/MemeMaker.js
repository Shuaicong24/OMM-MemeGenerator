/**
 * References:
 * https://www.youtube.com/watch?v=rtQKP1we-Dk
 * https://stackoverflow.com/questions/43992427/how-to-display-a-image-selected-from-input-type-file-in-reactjs
 * https://gist.github.com/petehouston/85dd33210c0764eeae55
 * https://react-bootstrap.github.io/components/modal/
 * */

import React, {useEffect, useState} from "react";
import "../styles/mememaker.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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
    const [uploaded, setUploaded] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setUploaded(false);
        setImage(null);
    };
    const handleShow = () => {
        setShow(true);
        setUploaded(false);
        setImage(null);
    };
    const handleUpload = () => {
        setShow(false);
        setTemplate(null);
        setUploaded(true);
        setImage(image);
    };


    const handleGenerate = () => {

    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => setTemplates(response.data.memes))
        );
    }, []);

    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    function clear() {
        setTopText('');
        setBottomText('');
    }

    function getRandomMeme() {
        const index = Math.floor(Math.random()*templates.length);
        const randomMeme = templates[index];
        console.log(randomMeme);
        setTemplate(randomMeme)
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
                    <Button variant="primary" onClick={handleShow}>
                        Upload a new template
                    </Button>

                    <div className="meme-area">
                        {template && <Meme template={template}/>}
                        {template && <p>{template.name}</p>}
                        {!template && uploaded && image && <img className="row" src={image} alt={"image"}/>}

                        <div className="top-caption">{topText}</div>
                        <div className="bottom-caption">{bottomText}</div>
                    </div>


                    <br/>
                    <input
                        placeholder="top text"
                        value={topText}
                        onChange={e => setTopText(e.target.value)}
                    />
                    <br/>
                    <input
                        placeholder="bottom text"
                        value={bottomText}
                        onChange={e => setBottomText(e.target.value)}
                    />
                    <br/>

                <Button onClick={clear}>Clear</Button>
                    <Button type="submit" onClick={handleGenerate}>Generate meme</Button>

                </form>

            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a way to upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" onChange={onImageChange}/>
                    <div>
                        {image && <img className="thumbnail" src={image} alt={"image"}/>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

            <canvas className="my-canvas"></canvas>
        </div>

    )
}

export default MemeMaker;