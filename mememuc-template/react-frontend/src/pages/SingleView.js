/**
 * References:
 * https://www.npmjs.com/package/react-input-multiline
 * https://medium.com/@s.alexis/using-react-router-useparams-to-fetch-data-dynamically-13288e24ed1
 * */

import React, {useEffect, useState} from 'react';
import logo from '../logo.jpg';
import '../styles/singleview.css';
import {MultilineInput} from 'react-input-multiline';
import { useParams } from 'react-router-dom';

function SingleView() {
    const [memes, setMemes] = useState(null);
    const [inputValue, setInputValue] = useState('Please comment here...');

    const {id} = useParams();

    useEffect(() => {
        fetch(" http://localhost:3002/memes/get-memes", {
            method: "GET",
        }).then((res) => res.json())
            .then((data) => {
                setMemes(data);
                console.log(data, "getMemes");
            });

        filterMeme();
    })

    const filterMeme = () => {
        //alert(memes);

    }

    return (
        <div>
            <h4>Title</h4>
            <div><img className='img' src={logo} alt="Generic placeholder image"/></div>
            <button className="button">
                previous
            </button>
            <button className="button">
                next
            </button>
            <div className='comment_block'>
                <div className='comment'>
                    <MultilineInput
                        value={inputValue}
                        id='comment'
                        onchange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <button className="btn_comment">
                    post comment
                </button>
            </div>
        </div>
    )
}

export default SingleView;
