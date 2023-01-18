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
 * Random id:
 * https://www.geeksforgeeks.org/generate-random-alpha-numeric-string-in-javascript/
 *
 * */

import React, {useEffect, useRef, useState} from "react";
import "../styles/mememaker.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {saveAs} from 'file-saver';

const LINK_MEME_PREFIX = 'http://localhost:3000/m/';

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
    const [title, setTitle] = useState('');
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [image, setImage] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const canvasRef = useRef(null);
    const [meme, setMeme] = useState(null);
    const [showGenerate, setShowGenerate] = useState(false);
    const [done, setDone] = useState('');
    const [result, setResult] = useState(null);
    const [filename, setFilename] = useState('');
    const [caption, setCaption] = useState('');
    const [id, setId] = useState('');

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
        setCaption(filename);
        setTitle('');
    };

    const handleCloseGenerate = () => {
        setShowGenerate(false);
    }

    function uploadId(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                setId(id);
                resolve(id);
            }, 100);
        })
    }

    const form = document.getElementById("generate-form");

    function submitForm() {
        form.submit();
    }

    const handleShowGenerate = () => {
        setTimeout("submitForm()", 2000);

        const myCanvas = document.getElementById("meme-canvas");
        const resultImg = new Image();
        console.log(meme)
        const formData = new FormData();

        if (meme != null && myCanvas.width != 0) {
            if (!title) {
                setTitle(caption);
            }

            setShowGenerate(true);
            const canvas = document.getElementById('meme-canvas');
            const dataURL = canvas.toDataURL();
            setDone(dataURL);

            resultImg.src = dataURL;
            setResult(resultImg);
            if (done) {
                console.log("dasdas")
            } else console.log("ADAW")
            console.log("fds:", typeof done);
            console.log(typeof result);
            const generatedImage = () => {
                setImage({
                    uri: done,
                    name: "image_name",
                    type: 'image/png', // if you can get image type from cropping replace here
                });
            }

            formData.append('file', generatedImage);
            formData.append('Content-Type', 'image/png');

            alert(typeof formData + ":" + formData);


            const id = uploadId(Math.random().toString(36).slice(2));

            const url = LINK_MEME_PREFIX + id;
            const time = new Date().getTime();
            const timeString = time.toString();
            const author = '';
            console.log(title, url, done, timeString, author);

            const {mTitle, mUrl, mDone, mDate, mAuthor} = {title, url, done, timeString, author}; // undefined
            console.log(mTitle, mUrl, mDone, mDate, mAuthor);

            fetch("http://localhost:3002/upload", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                data: formData,
            }).then(res => res.json())
                .then(data => console.log(data, "generateMeme"))
        } else {
            console.log("QAXCE")
        }


    }

    const handleDownload = () => {
        const doneImg = document.getElementById("done");
        let imgPath = doneImg.getAttribute('src');
        let fileName = getFileName(imgPath);
        saveAs(imgPath, fileName)
    };

    function getFileName(str) {
        return str.substring(str.length - 20);
    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => setTemplates(response.data.memes))
        );
    }, []);

    function draw(canvas) {
        const myCanvas = document.getElementById("meme-canvas");

        // assume that at this moment there is a pic on the canvas
        if (meme.width != 0) {
            myCanvas.width = meme.width;
            myCanvas.height = meme.height;

            const ctx = canvas.current.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(meme, 0, 0);

            ctx.font = "60px Comic Sans MS";
            ctx.fillStyle = "green";
            ctx.textAlign = "center";

            ctx.fillText(topText, (myCanvas.width / 2), 100, myCanvas.width);
            ctx.fillText(bottomText, (myCanvas.width / 2), myCanvas.height - 100, myCanvas.width);
        } else {
            myCanvas.width = 0;
            myCanvas.height = 0;
        }
    }

    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
        const fileName = e.target.files[0].name;
        const targetName = fileName.substring(0, fileName.indexOf('.'));

        setFilename(targetName);
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
                                      setCaption(template.name);
                                      setTitle('');
                                  }}
                    />)
                })}
            </div>
            <div>
                <form
                    id="generate-form"
                    action="http://localhost:3002/upload"
                    method="POST"
                    onSubmit={async e => {
                        // Blocking page bounces
                        e.preventDefault();
                    }}
                >
                    <Button variant="primary" onClick={handleShowUpload}>
                        Upload a new template
                    </Button>

                    <p>* After choosing/uploading a template, it won't show immediately. You should add text or click
                        again to see it on canvas.</p>

                    Name a title
                    <input
                        type="text"
                        placeholder={'name it'}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <br/>
                    <canvas id="meme-canvas" ref={canvasRef} width="0" height="0">
                        {meme && draw(canvasRef)}
                    </canvas>
                    <p>{caption}</p>


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
            <script></script>
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
                    <p>{title}</p>
                    <img id="done" className="done" alt={"result-meme"} src={done}/>
                    <p style={{'marginTop': '4px'}}>Image Link: <a
                        href={LINK_MEME_PREFIX + id}>{LINK_MEME_PREFIX}{id}</a></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDownload}>
                        Download
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="container">
                <div className="row">
                    <div className="col-sm-8 mt-3">
                        <h4>Node.js upload images - bezkoder.com</h4>

                        <form
                            className="mt-4"
                            action="http://localhost:3002/upload"
                            method="POST"
                            encType="multipart/form-data"
                        >
                            <div className="form-group">
                                <input
                                    type="file"
                                    name="file"
                                    multiple
                                    id="input-files"
                                    className="form-control-file border"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="preview-images"></div>
                    </div>
                </div>
            </div>
            {/*<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>*/}
            {/*<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>*/}
            {/*<script>*/}
            {/*    $(document).ready(function() {*/}
            {/*    var imagesPreview = function(input, placeToInsertImagePreview) {*/}
            {/*    if (input.files) {*/}
            {/*    let filesAmount = input.files.length;*/}
            {/*    for (i = 0; i < filesAmount; i++) {*/}
            {/*    let reader = new FileReader();*/}
            {/*    reader.onload = function(event) {*/}
            {/*    $($.parseHTML("<img>"))*/}
            {/*    .attr("src", event.target.result)*/}
            {/*    .appendTo(placeToInsertImagePreview);*/}
            {/*};*/}
            {/*    reader.readAsDataURL(input.files[i]);*/}
            {/*}*/}
            {/*}*/}
            {/*};*/}
            {/*    $("#input-files").on("change", function() {*/}
            {/*    imagesPreview(this, "div.preview-images");*/}
            {/*});*/}
            {/*});*/}
            {/*</script>*/}

        </div>
    )
}

export default MemeMaker;