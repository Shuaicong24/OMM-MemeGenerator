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

//TODO: Left and right buttons need to be correctly matched for different cases of data (like data from Overview, from provided Link after generation (MemeMaker), from History, and so on.)
function SingleView() {
    // localhost:3000/m/:id
    const {id} = useParams();
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [publicData, setPublicData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const firstMeme = (array) => {
        const memeFrom = window.localStorage.getItem('memeFrom');
        if (memeFrom === 'Overview') {
            for (let i = 0; i < array.length; i++) {
                if (array[i].url === `http://localhost:3000/m/${id}`) {
                    setCurrentIndex(i);
                }
            }
        }
        if (memeFrom === 'MemeMaker') {
            let isPublic = 'false';
            for (let i = 0; i < array.length; i++) {
                if (array[i].url === `http://localhost:3000/m/${id}`) {
                    isPublic = 'true';
                    setCurrentIndex(i);
                }
            }
            localStorage.setItem('isPublic', isPublic);
        }
    }

    const doLeft = (currentIndex) => {
        const newMemeUrl = publicData[currentIndex - 1].url;
        const newId = newMemeUrl.substring(newMemeUrl.lastIndexOf('/') + 1);
        window.location = `http://localhost:3000/m/${newId}`;
        setCurrentIndex(currentIndex - 1);
    }

    const handleLeft = () => {
        const memeFrom = window.localStorage.getItem("memeFrom");

        if (memeFrom === 'Overview') {
            if (currentIndex !== 0) {
                doLeft(currentIndex);
            } else {
                alert('Current is the first one, cannot find the older one');
            }
        }

        if (memeFrom === 'MemeMaker') {
            const isPublic = localStorage.getItem('isPublic');
            if (isPublic === 'true') {
                if (currentIndex !== 0) {
                    doLeft(currentIndex);
                } else {
                    alert('Current is the first one, cannot find the older one');
                }
            } else {
                if (currentIndex > 0) {
                    doLeft(currentIndex);
                }
                if (currentIndex === -1 || currentIndex === 0) {
                    alert('Current is the first one, cannot find the older one');
                }
            }
        }
    }

    const handleRight = () => {
        const memeFrom = window.localStorage.getItem("memeFrom");

        if ((memeFrom === 'Overview' || memeFrom === 'MemeMaker') && currentIndex !== publicData.length - 1) {
            const newMemeUrl = publicData[currentIndex + 1].url;
            const newId = newMemeUrl.substring(newMemeUrl.lastIndexOf('/') + 1);
            window.location = `http://localhost:3000/m/${newId}`;
            setCurrentIndex(currentIndex + 1);
        }
        if (currentIndex === publicData.length - 1) {
            alert('Current is the last one, cannot find the latest one');
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

    function getPublicMeme(data) {
        const array = [];
        data.forEach(meme => {
            if (meme.permission === 'public') {
                array.push(meme);
            }
        })
        setPublicData(array);
        firstMeme(array);
    }

    useEffect(() => {
        fetch("http://localhost:3002/memes/get-memes")
            .then(response => response.json())
            .then(data => {
                setData(data);
                getPublicMeme(data);
            });
    }, [])

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
