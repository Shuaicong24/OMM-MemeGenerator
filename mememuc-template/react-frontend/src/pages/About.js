import React from "react";
import "../styles/api.css";

function About() {
    return (
        <div>
            <div className="api">
                    <p className="api_caption">About</p>
                    <div className="line"></div>
                    <p className="text">
                        Here is a group project called "Meme Generator" for the Online Multimedia Lecture in the winter semester 2022/23 at LMU Munich.
                        It is a website similar to <a href={"https://imgflip.com/"}>imgflip</a>.<br/>
                        Team Members (Group 002): Shuaicong Wu, Shuning Zhang
                    </p>
            </div>
            <div className="bottom-space"/>
        </div>
    );
}

export default About;
