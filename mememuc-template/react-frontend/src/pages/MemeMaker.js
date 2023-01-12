/**
 * References:
 * https://react-bootstrap.github.io/components/modal/
 * Basic skeleton:
 * https://www.youtube.com/watch?v=rtQKP1we-Dk
 * https://codesandbox.io/s/loving-pare-ifwr1?file=/src/App.js:445-842
 * Issues fixed:
 * https://stackoverflow.com/questions/43992427/how-to-display-a-image-selected-from-input-type-file-in-reactjs
 * https://stackoverflow.com/questions/23104582/scaling-an-image-to-fit-on-canvas
 * https://stackoverflow.com/questions/29334416/bootstrap-modal-dialog-center-image-in-body
 * Get image data on the canvas (Tainted canvases may not be exported):
 * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
 * Download meme:
 * https://www.youtube.com/watch?v=wsGrRrWe86A
 *
 * */

import React, {useEffect, useRef, useState} from "react";
import "../styles/mememaker.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { saveAs } from 'file-saver';

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
    const [showUpload, setShowUpload] = useState(false);
    const canvasRef = useRef(null);
    const [meme, setMeme] = useState(null);
    const [showGenerate, setShowGenerate] = useState(false);
    const [done, setDone] = useState('');

    const handleCloseUpload = () => {
        setShowUpload(false);
        setImage(null);
    };
    const handleShowUpload = () => {
        setShowUpload(true);
        setImage(null);
    };
    const handleUpload = () => {
        const memeImage = new Image();
        setShowUpload(false);
        setTemplate(null);
        setImage(image);
        memeImage.src = image.toString();
        memeImage.crossOrigin = "anonymous"
        setMeme(memeImage);
    };

    const handleCloseGenerate = () => {
        setShowGenerate(false);
    }
    const handleShowGenerate = () => {
        setShowGenerate(true);
        const canvas = document.getElementById('meme-canvas');
        const dataURL = canvas.toDataURL();
        setDone(dataURL);
    };
    const handleDownload = () => {
        const done = document.getElementById("done");
        let imgPath = done.getAttribute('src');
        console.log('path: ', imgPath);
        let fileName = getFileName(imgPath);
        saveAs(imgPath, fileName)
    };

    function getFileName(str) {
        return str.substring(str.lastIndexOf('/')+1);

    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => setTemplates(response.data.memes))
        );
    }, []);

    function draw(canvas) {
        canvas.width = 400;
        canvas.height = 400;

        const ctx = canvas.current.getContext("2d");
        ctx.fillStyle = "white";

        const hRatio = canvas.width / meme.width;
        const vRatio = canvas.height / meme.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShift_x = (canvas.width - meme.width * ratio) / 2;
        const centerShift_y = (canvas.height - meme.height * ratio) / 2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(meme, 0, 0, meme.width, meme.height,
            centerShift_x, centerShift_y, meme.width * ratio, meme.height * ratio);

        ctx.font = "20px Comic Sans MS"
        ctx.fillStyle = "green"
        ctx.textAlign = "center"

        ctx.fillText(topText, (400 / 2), centerShift_y + 25, 400)
        ctx.fillText(bottomText, (400 / 2), 400 - centerShift_y - 25, 400)

    }

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
        const index = Math.floor(Math.random() * templates.length);
        const randomMeme = templates[index];
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
                                      const memeImage = new Image();
                                      memeImage.src = template.url.toString();
                                      memeImage.crossOrigin = "anonymous"
                                      setMeme(memeImage);
                                  }}
                    />)
                })}
            </div>
            <div>
                <form onSubmit={async e => {
                    e.preventDefault();
                }}>
                    <Button variant="primary" onClick={handleShowUpload}>
                        Upload a new template
                    </Button>

                    <p>* After choosing/uploading a template, it won't show immediately. You should add text or click again to see it on canvas.</p>

                    <canvas id="meme-canvas" ref={canvasRef} width="400" height="400">
                        {meme && draw(canvasRef)}
                    </canvas>
                    {template && <p>{template.name}</p>}

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
                    <Button id="generate" type="submit" onClick={handleShowGenerate}>Generate meme</Button>
                </form>

            </div>

            <Modal show={showUpload} onHide={handleCloseUpload}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a way to upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="file" onChange={onImageChange}/>
                    <div>
                        {image && <img id="thumbnail" className="thumbnail" src={image} alt={"image"}/>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpload}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showGenerate} onHide={handleCloseGenerate}>
                <Modal.Header closeButton>
                    <Modal.Title>Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img id="done" className="done" alt={"result-meme"} src={done}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDownload}>
                        Download
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default MemeMaker;