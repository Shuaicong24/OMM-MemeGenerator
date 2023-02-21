/**
 * References:
 * https://www.pluralsight.com/guides/how-to-use-multiline-text-area-in-reactjs
 * https://medium.com/@s.alexis/using-react-router-useparams-to-fetch-data-dynamically-13288e24ed1
 * Css line break:
 * https://css-tricks.com/almanac/properties/l/line-break/
 * */

import React, {useEffect, useState} from 'react';
import '../styles/singleview.css';
import {useParams} from 'react-router-dom';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function SingleView() {
    // localhost:3000/m/:id
    const {id} = useParams();
    const [data, setData] = useState([]);
    const [publicData, setPublicData] = useState([]);
    const [comment, setComment] = useState('');
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [showLogin, setShowLogin] = useState(false);
    const [comments, setComments] = useState([]);


    useEffect(() => {
        fetchAllData();
        fetchPublicData();
        getCommentsByUrl(`http://localhost:3000/m/${id}`);
    }, [])

    const fetchAllData = () => {
        fetch("http://localhost:3002/memes/get-memes")
            .then(response => response.json())
            .then(data => {
                setData(data);
            });
    }

    const fetchPublicData = () => {
        fetch("http://localhost:3002/memes/get-public-memes")
            .then(response => response.json())
            .then(data => {
                setPublicData(data);
                confirmFirstMemeAndIndex(data);
            });
    }

    const confirmFirstMemeAndIndex = (data) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].url === `http://localhost:3000/m/${id}`) {
                setCurrentIndex(i);
            }
        }
    }

    const doLeft = (currentIndex) => {
        const newMemeUrl = publicData[currentIndex - 1].url;
        const newId = newMemeUrl.substring(newMemeUrl.lastIndexOf('/') + 1);
        window.location = `http://localhost:3000/m/${newId}`;
        setCurrentIndex(currentIndex - 1);
    }

    const handleLeft = () => {
        const memeFrom = localStorage.getItem("memeFrom");
        const isPublic = localStorage.getItem('isPublic');

        if (memeFrom === 'Overview' || memeFrom === 'History') {
            if (currentIndex > 0) {
                doLeft(currentIndex);
            } else {
                alert('Current is the first one, cannot find the previous one');
            }
        }

        if (memeFrom === 'MemeMaker') {
            if (isPublic === 'true') {
                if (currentIndex < publicData.length - 1) {
                    doRight(currentIndex);
                } else {
                    alert('Current is the first one, cannot find the previous one');
                }
            } else {
                if (currentIndex > 0) {
                    doLeft(currentIndex);
                }
                if (currentIndex === -1 || currentIndex === 0) {
                    alert('Current is the first one, cannot find the previous one');
                }
            }
        }
    }

    const doRight = (currentIndex) => {
        const newMemeUrl = publicData[currentIndex + 1].url;
        const newId = newMemeUrl.substring(newMemeUrl.lastIndexOf('/') + 1);
        window.location = `http://localhost:3000/m/${newId}`;
        setCurrentIndex(currentIndex + 1);
    }

    const handleRight = () => {
        const memeFrom = localStorage.getItem("memeFrom");
        const isPublic = localStorage.getItem('isPublic');

        if ((memeFrom === 'Overview' || memeFrom === 'History')) {
            if (currentIndex !== publicData.length - 1) {
                doRight(currentIndex);
            } else {
                alert('Current is the last one, cannot find the next one');
            }
        }
        if (memeFrom === 'MemeMaker') {
            if (isPublic === 'true') {
                if (currentIndex !== 0) {
                    doLeft(currentIndex);
                } else {
                    alert('Current is the last one, cannot find the next one');
                }
            } else {
                if (currentIndex < publicData.length - 1) {
                    doRight(currentIndex);
                } else {
                    alert('Current is the last one, cannot find the next one');
                }
            }
        }
    }

    const handleRandom = () => {
        const index = Math.floor(Math.random() * publicData.length);
        const randomMemeUrl = publicData[index].url;
        const newId = randomMemeUrl.substring(randomMemeUrl.lastIndexOf('/') + 1);
        window.location = `http://localhost:3000/m/${newId}`;
        setCurrentIndex(index);
    }

    const handleCheckLogin = () => {
        if (localStorage.getItem("logStatus") === 'notLogged') {
            setShowLogin(true);
        }
    }

    const handleCloseLogin = () => {
        setShowLogin(false);
    }

    const Meme = ({meme}) => {
        return (
            <div>
                <h4>{meme.title}</h4><span style={{'fontSize': '12px'}}>by {meme.author}</span>

                <div><img className='img' src={meme.img} alt="Generic placeholder image"/></div>
                <Button className="button" onClick={handleLeft}>
                    Left
                </Button>
                <Button className="button" onClick={handleRight}>
                    Right
                </Button>
                <Button className="button" onClick={handleRandom}>
                    Random
                </Button>
            </div>
        );
    }

    const Comment = ({comment}) => {
        return (
            <div className="single_comment">
                <p className="strict">{comment.content}</p>
                <div>
                    <span className="from_someone">from {comment.from}</span>
                </div>
            </div>
        );

    }
    const handelPostComment = () => {
        if (localStorage.getItem("logStatus") === 'notLogged') {
            setShowLogin(true);
        } else {
            let to = '';
            const url = `http://localhost:3000/m/${id}`;
            const from = localStorage.getItem('loggedUsername');
            console.log('Comment data');
            console.log(`http://localhost:3000/m/${id}`);
            console.log(localStorage.getItem('loggedUsername'));
            data.map(meme => {
                if (meme.url === `http://localhost:3000/m/${id}`) {
                    console.log(meme.author);
                    to = meme.author;
                }
            })
            console.log(comment);

            fetch("http://localhost:3002/memes/upload-comment", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    url,
                    from,
                    to,
                    comment
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data, "memeComment");
                     if (data.status === "ok") {
                         alert("Comment successful");
                         setComment('');
                         getCommentsByUrl(`http://localhost:3000/m/${id}`);
                     }
                });
        }
    }

    const getCommentsByUrl = (url) => {
        fetch(`http://localhost:3002/memes/get-comments-for-a-meme/?url=${url}`)
            .then((res) => res.json())
            .then((data) => {
                setComments(data);
                console.log(data, "getCommentsByUrl");
            });
    }

    return (
        <div>
            {data && data.map(meme =>
                meme.url === `http://localhost:3000/m/${id}` &&
                <Meme key={meme.url}
                      meme={meme}/>
            )}
            {data && data.map(meme =>
                meme.url === `http://localhost:3000/m/${id}` &&
                <div className='comment_block' key={meme.url}>
                    <textarea className='comment'
                            placeholder={'Please comment here...'}
                            id={meme.url}
                              value={comment}
                            onClick={handleCheckLogin}
                            onChange={e => setComment(e.target.value)}
                    />
                    <Button className="btn_comment" onClick={handelPostComment}>
                            Post comment
                    </Button>
                    <h4 className="comments">Comments</h4>
                </div>
            )}

            {comments && comments.map(comment =>
                <Comment key={comment.date}
                    comment={comment}/>)}

            <Modal show={showLogin} onHide={handleCloseLogin}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You are only allowed to comment when you're logged in!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" href="/sign-in">
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SingleView;
