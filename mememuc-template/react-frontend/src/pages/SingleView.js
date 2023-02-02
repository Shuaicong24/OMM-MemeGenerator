/**
 * References:
 * https://www.npmjs.com/package/react-input-multiline
 * https://medium.com/@s.alexis/using-react-router-useparams-to-fetch-data-dynamically-13288e24ed1
 * */

import React, {useEffect, useState} from 'react';
import '../styles/singleview.css';
import {MultilineInput} from 'react-input-multiline';
import {useParams} from 'react-router-dom';
import Button from "react-bootstrap/Button";

function SingleView() {
    // localhost:3000/m/:id
    const {id} = useParams();
    const [data, setData] = useState([]);
    const [publicData, setPublicData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentIndex, setCurrentIndex] = useState(-1);

    useEffect(() => {
        fetchAllData();
        fetchPublicData();
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

    const Meme = ({meme}) => {
        return (
            <div>
                <h4>{meme.title}</h4><span style={{'fontSize': '12px'}}>by {meme.author}</span>

                <div><img className='img' src={meme.img} alt="Generic placeholder image"/></div>
                <Button className="button" onClick={handleLeft}>
                    left
                </Button>
                <Button className="button" onClick={handleRight}>
                    right
                </Button>
                <Button className="button" onClick={handleRandom}>
                    random
                </Button>
                <div className='comment_block'>
                    <div className='comment'>
                        <MultilineInput
                            placeholder={'Please comment here...'}
                            value={inputValue}
                            id='comment'
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <Button className="btn_comment">
                        post comment
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {data && data.map(meme =>
                meme.url === `http://localhost:3000/m/${id}` &&
                <Meme key={meme.toString()}
                      meme={meme}/>
            )}
        </div>
    )
}

export default SingleView;
