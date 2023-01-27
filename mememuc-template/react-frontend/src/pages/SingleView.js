/**
 * References:
 * https://www.npmjs.com/package/react-input-multiline
 * https://medium.com/@s.alexis/using-react-router-useparams-to-fetch-data-dynamically-13288e24ed1
 * */

import React, {useEffect, useState} from 'react';
import logo from '../logo.jpg';
import '../styles/singleview.css';
import {MultilineInput} from 'react-input-multiline';
import {useParams} from 'react-router-dom';
import Button from "react-bootstrap/Button";

function SingleView() {
    const [data, setData] = useState([]);
    const [meme, setMeme] = useState(null);
    const [inputValue, setInputValue] = useState('Please comment here...');

    // localhost:3000/m/:id
    const {id} = useParams();

    const Meme = ({meme}) => {
        return (
            <div>
                <h4>{meme.title}</h4>
                <div><img className='img' src={meme.img} alt="Generic placeholder image"/></div>
                <Button className="button">
                    previous
                </Button>
                <Button className="button">
                    next
                </Button>
                <div className='comment_block'>
                    <div className='comment'>
                        <MultilineInput
                            value={inputValue}
                            id='comment'
                            onchange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <Button className="btn_comment">
                        post comment
                    </Button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        fetch("http://localhost:3002/memes/get-memes")
            .then(response => response.json())
            .then(data => {
                setData(data);
                data.forEach(x => {
                    if (x.url == `http://localhost:3000/m/${id}`) {
                        setMeme(x);
                        console.log(x, 'chosenMeme');
                    }
                })
            });
        console.log(localStorage.getItem("firstMeme"));
    }, [])

    return (
        <div>
            {data && data.map(meme =>
                meme.url == `http://localhost:3000/m/${id}` &&
                <Meme key={meme.toString()}
                      meme={meme}/>
            )}
        </div>
    )
}

export default SingleView;
