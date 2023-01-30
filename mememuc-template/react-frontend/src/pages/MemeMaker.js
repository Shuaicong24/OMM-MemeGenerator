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
 * Radio button:
 * help from Xueru Zheng, Group 070
 * https://www.javascripttutorial.net/javascript-dom/javascript-radio-button/
 * Upload meme(info) to MongoDB (especially image part):
 * help from Xueru Zheng, Group 070
 * https://stackoverflow.com/questions/12168909/blob-from-dataurl
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
 * Redirect to dynamic URLs (Single View URL):
 * https://medium.com/@s.alexis/using-react-router-useparams-to-fetch-data-dynamically-13288e24ed1
 * The idea that adding an image does not change the current image on the canvas, i.e. continuously append pictures, using an array:
 * help from Xueru Zheng, Group 070
 * */

import React, {useEffect, useRef, useState} from "react";
import "../styles/mememaker.css"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {saveAs} from 'file-saver';
import {Link} from 'react-router-dom';

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
    const [filename, setFilename] = useState('');
    const [caption, setCaption] = useState('');
    const [id, setId] = useState('');
    const [permission, setPermission] = useState('public');

    const [showAddImage, setShowAddImage] = useState(false);
    const [addImage, setAddImage] = useState(null);
    const [append, setAppend] = useState('undefined');
    const [added, setAdded] = useState(false);
    const [addedImages, setAddedImages] = useState([]);

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
        memeImage.crossOrigin = "anonymous"
        memeImage.src = image.toString();
        setMeme(memeImage);
        setCaption(filename);
        setTitle('');
        setAdded(false);
        setAddedImages([]);
    };

    const handleCloseGenerate = () => {
        setShowGenerate(false);
    }

    const handleShowGenerate = () => {
        const canvas = canvasRef.current;
        if (meme != null && canvas.width != 0) {
            if (!title) {
                setTitle(caption);
            }

            setShowGenerate(true);
            const dataURL = canvas.toDataURL();
            setDone(dataURL);
        }
        uploadMeme(permission);
    }

    const handleDownload = () => {
        const doneImg = document.getElementById("done");
        let imgPath = doneImg.getAttribute('src');
        let fileName = getFileName(imgPath);
        saveAs(imgPath, fileName)
    };

    const handlePermission = (e) => {
        setPermission(e.target.value);
    }

    function uploadMeme(permission) {
        // upload meme to db
        const formData = new FormData();

        const dataURL = canvasRef.current.toDataURL();
        const date = Date.now();
        const url = LINK_MEME_PREFIX + date;
        setId(date.toString());
        if (title) {
            formData.append("title", title);
        } else {
            formData.append("title", caption);
        }

        formData.append("url", url);
        formData.append("file", convertDataToBlob(dataURL));
        formData.append("author", 'anonymous');
        formData.append("permission", permission);

        fetch(" http://localhost:3002/memes/upload-meme", {
            method: "POST",
            body: formData,
        }).then((res) => res.json())
            .then((data) => {
                console.log(data, "uploadMeme");
            });
    }

    function convertDataToBlob(dataURL) {
        const byteString = atob(dataURL.split(",")[1]);
        const array = [];
        for (let i = 0; i < byteString.length; i++) {
            array.push(byteString.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: "image/png"});
    }

    function getFileName(str) {
        return str.substring(str.length - 20);
    }

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes").then(x =>
            x.json().then(response => {
                    setTemplates(response.data.memes);
                    handleRandom(response.data.memes);
                }
            ))
    }, []);

    const handleRandom = (memes) => {
        const index = Math.floor(Math.random() * memes.length);
        console.log(memes[1]);
        setImage(null);
        setTemplate(memes[index]);
        const memeImage = new Image();
        memeImage.crossOrigin = "anonymous"
        memeImage.src = memes[index].url.toString();
        setMeme(memeImage);
        setCaption(memes[index].name);
        setTitle('');
    }

    function draw(canvas) {
        const myCanvas = canvasRef.current;

        // assume that at this moment there is a pic on the canvas
        if (meme.width != 0) {
            myCanvas.width = meme.width;
            myCanvas.height = meme.height;

            const ctx = canvas.current.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(meme, 0, 0);

            // store previous status of canvas
            const oldCanvas = document.createElement('canvas');
            const oldCanvasCtx = oldCanvas.getContext('2d');

            for (let i = 0; i < addedImages.length; i++) {
                const imgUrl = addedImages[i].imgUrl;
                const pos = addedImages[i].pos;

                oldCanvas.width = myCanvas.width;
                oldCanvas.height = myCanvas.height;
                oldCanvasCtx.drawImage(myCanvas, 0, 0);

                if (pos === 'left') {
                    const addedImage = new Image();
                    addedImage.src = imgUrl.toString();
                    const ratioHeight = myCanvas.height / addedImage.height;
                    addedImage.height = addedImage.height * ratioHeight;
                    addedImage.width = addedImage.width * ratioHeight;

                    myCanvas.width = myCanvas.width + addedImage.width;

                    ctx.drawImage(addedImage, 0, 0, addedImage.width, addedImage.height);
                    ctx.drawImage(oldCanvas, addedImage.width, 0, oldCanvas.width, oldCanvas.height);
                } else if (pos === 'right') {
                    const addedImage = new Image();
                    addedImage.src = imgUrl.toString();
                    const ratioHeight = myCanvas.height / addedImage.height;
                    addedImage.height = addedImage.height * ratioHeight;
                    addedImage.width = addedImage.width * ratioHeight;

                    myCanvas.width = myCanvas.width + addedImage.width;

                    ctx.drawImage(oldCanvas, 0, 0, oldCanvas.width, oldCanvas.height);
                    ctx.drawImage(addedImage, oldCanvas.width, 0, addedImage.width, addedImage.height);
                } else if (pos === 'above') {
                    const addedImage = new Image();
                    addedImage.src = imgUrl.toString();
                    const ratioWidth = myCanvas.width / addedImage.width;
                    addedImage.height = addedImage.height * ratioWidth;
                    addedImage.width = addedImage.width * ratioWidth;

                    myCanvas.height = myCanvas.height + addedImage.height;

                    ctx.drawImage(addedImage, 0, 0, addedImage.width, addedImage.height);
                    ctx.drawImage(oldCanvas, 0, addedImage.height, oldCanvas.width, oldCanvas.height);
                } else if (pos === 'below') {
                    const addedImage = new Image();
                    addedImage.src = imgUrl.toString();
                    const ratioWidth = myCanvas.width / addedImage.width;
                    addedImage.height = addedImage.height * ratioWidth;
                    addedImage.width = addedImage.width * ratioWidth;

                    myCanvas.height = myCanvas.height + addedImage.height;

                    ctx.drawImage(oldCanvas, 0, 0, oldCanvas.width, oldCanvas.height);
                    ctx.drawImage(addedImage, 0, oldCanvas.height, addedImage.width, addedImage.height);
                }
            }

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

    function handleLink() {
        window.localStorage.setItem("memeFrom", "MemeMaker");
    }

    const handleAddImage = () => {
        setShowAddImage(true);
        setAppend('undefined');
        setAddImage(null);
        setAdded(false);
    }

    const handleCloseAddImage = () => {
        setShowAddImage(false);
        setAddImage(null);
        setAdded(false);
    }

    const onAddImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAddImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleAddedImageUpload = () => {
        setShowAddImage(false);
        setTemplate(null);
        setImage(null);
        setAdded(true);
        appendImage(addImage, append);
    }

    const handleAppend = (e) => {
        setAppend(e.target.value);
    }

    const appendImage = (imgUrl, pos) => {
        console.log(`current appended images: ${addedImages.toString()}`);
        addedImages.push({
            imgUrl: imgUrl,
            pos: pos
        });
        console.log(`updated appended images:${addedImages.toString()}`);
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
                                      memeImage.crossOrigin = "anonymous"
                                      memeImage.src = template.url.toString();
                                      setMeme(memeImage);
                                      setCaption(template.name);
                                      setTitle('');
                                      setAdded(false);
                                      setAddedImages([]);
                                  }}
                    />)
                })}
            </div>
            <div>
                <form onSubmit={async e => {
                    // Blocking page bounces
                    e.preventDefault();
                }}
                >
                    <Button variant="primary" onClick={handleShowUpload}>
                        Upload a new template
                    </Button>

                    <p>* After choosing/uploading a template, it won't show immediately. You should add text or click
                        again to see it on canvas.</p>

                    <div className="parent-div">
                        <div className="left-div">
                            <div className="options">
                                <Button type="submit" onClick={handleAddImage}>Add image</Button>
                            </div>
                            <canvas id="meme-canvas" ref={canvasRef} width="0" height="0">
                                {meme && draw(canvasRef)}
                            </canvas>
                            <p>{caption}</p>
                            <br/>
                        </div>
                        <div className="right-div">
                            Name a title
                            <input
                                type="text"
                                placeholder={'name it'}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
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
                            <div>
                                Set meme's permission
                                <div>
                                    <input type="radio" name="privacy" value="public" id="public"
                                           checked={permission == "public"} onChange={handlePermission}/>
                                    <label htmlFor="public">Public <span style={{'fontSize': '12px'}}>(Provide single view link, show on Overview)</span></label>
                                </div>
                                <div>
                                    <input type="radio" name="privacy" value="unlisted" id="unlisted"
                                           checked={permission == "unlisted"} onChange={handlePermission}/>
                                    <label htmlFor="unlisted">Unlisted <span style={{'fontSize': '12px'}}>(Provide single view link, doesn't show on Overview)</span></label>
                                </div>
                                <div>
                                    <input type="radio" name="privacy" value="private" id="private"
                                           checked={permission == "private"} onChange={handlePermission}/>
                                    <label htmlFor="private">Private <span style={{'fontSize': '12px'}}>(Only for download, and visible to the creator after login)</span></label>
                                </div>
                            </div>
                            <Button id="generate" type="submit" onClick={handleShowGenerate}>Generate meme</Button>

                        </div>

                    </div>


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
                    <p>{title}</p>
                    <img id="done" className="done" alt={"result-meme"} src={done}/>
                    {(permission == "public" || permission === "unlisted") &&
                        <p style={{'marginTop': '4px'}}>Meme Link: <Link to={`/m/${id}`}
                                                                         onClick={handleLink()}>{LINK_MEME_PREFIX}{id}</Link>
                        </p>}
                    {permission == "private" && <p style={{'marginTop': '4px'}}>Now you can only download it!</p>}

                </Modal.Body>
                <Modal.Footer>
                    {permission == "public" &&
                        <Button variant="primary" href="/">
                            To Overview
                        </Button>}
                    <Button variant="primary" onClick={handleDownload}>
                        Download
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddImage} onHide={handleCloseAddImage}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a way to append an image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <input type="radio" name="append" value="left" id="left"
                               checked={append === "left"} onChange={handleAppend}/>
                        <label htmlFor="left">Left</label>
                    </div>
                    <div>
                        <input type="radio" name="append" value="right" id="right"
                               checked={append === "right"} onChange={handleAppend}/>
                        <label htmlFor="right">Right</label>
                    </div>
                    <div>
                        <input type="radio" name="append" value="above" id="above"
                               checked={append === "above"} onChange={handleAppend}/>
                        <label htmlFor="above">Above</label>
                    </div>
                    <div>
                        <input type="radio" name="append" value="below" id="below"
                               checked={append === "below"} onChange={handleAppend}/>
                        <label htmlFor="below">Below</label>
                    </div>
                    <input type="file" onChange={onAddImageChange}/>
                    <div>
                        {addImage && <img id="thumbnail" className="thumbnail" src={addImage} alt={"image"}/>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAddedImageUpload}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default MemeMaker;