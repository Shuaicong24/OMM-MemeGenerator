import React from "react";
import "../styles/api.css";

function About() {
    return (
        <div>
            <div className="api">
                    <p className="api_caption">About</p>
                    <div className="line"></div>
                    <p className="project-title">This project</p>
                    <p className="text">
                        Here is a group project called "Meme Generator" for the Online Multimedia Lecture in the winter semester 2022/23 at LMU Munich.
                        It is a website similar to <a href={"https://imgflip.com/"}>imgflip</a>. The main functions include creating and viewing memes,
                        commenting on them, managing accounts, data statistics, and providing API, etc.<br/>
                    </p>
                    <p className="text">Refer to the GitHub website for specific code information: <a href={"https://github.com/Shuaicong24/OMM-MemeGenerator"}>OMM-MemeGenerator</a>
                    </p>
                    <p className="title">The Team</p>
                <p className="text">
                    Our group is Group 002. Group members and majors are: <br/>
                    Shuaicong Wu (Computer Science, Master)<br/>
                    Shuning Zhang (Computer Science, Master)
                </p>
            </div>
            <div className="bottom-space"/>
        </div>
    );
}

export default About;
