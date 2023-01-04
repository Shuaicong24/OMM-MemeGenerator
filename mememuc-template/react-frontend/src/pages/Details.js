/**
 * References:
 * https://www.npmjs.com/package/react-input-multiline
 * */

import React, { useState } from 'react';
import logo from '../logo.jpg';
import '../styles/details.css';
import { MultilineInput } from 'react-input-multiline';

function Details() {
    const [inputValue, setInputValue] = useState('Please comment here...');
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

export default Details;
