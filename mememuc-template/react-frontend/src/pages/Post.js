/**
 * References:
 * https://getbootstrap.com/docs/4.0/layout/media-object/#example
 * https://stackoverflow.com/questions/50644976/react-button-onclick-redirect-page
 * */

import Card from 'react-bootstrap/Card';
import "../styles/post.css";
import logo from '../logo.jpg';
import Nav from "react-bootstrap/Nav";
import React from "react";
import {useNavigate} from 'react-router-dom';

function Post() {

    let navigate = useNavigate();
    const element = document.getElementById('singlepost')

    function navigateToSingleView() {
        navigate('meme', {
            itemId: 1
        });
    }

    return (
        <>
            <div id="singlepost" className="parent-div" onClick={navigateToSingleView}>
                <div className="media-left">
                    <img className="img" src={logo} alt="Generic placeholder image"/>
                </div>
                <div className="media-body">
                    <h5>Title</h5>
                    <p>by author</p>
                </div>
            </div>
        </>
    );
}

export default Post;