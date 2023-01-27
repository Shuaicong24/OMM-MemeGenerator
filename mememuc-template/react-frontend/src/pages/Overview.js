/**
 * References:
 * https://react-bootstrap.github.io/components/navbar/
 * https://www.youtube.com/watch?v=SLfhMt5OUPI
 * https://www.youtube.com/watch?v=bBUOMy6Tugw (Potential)
 * https://getbootstrap.com/docs/4.0/layout/media-object/#example
 * https://stackoverflow.com/questions/8919682/remove-all-styling-formatting-from-hyperlinks
 * */

import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../styles/overview.css";

function Overview() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(" http://localhost:3002/memes/get-memes")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
            });
    }, [])

    return (
        <div>
            <Navbar className="top">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/#sort=latest">New</Nav.Link>
                        <Nav.Link href="/#sort=title">Title</Nav.Link>
                        <NavDropdown
                            title="Sort by"
                            menuVariant="light">
                            <NavDropdown.Item href="/#sort=votes">Votes</NavDropdown.Item>
                            <NavDropdown.Item href="/#sort=views">Views</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            {data && data.map((meme) =>
                meme.permission == "public" &&
                <div id="singlepost" className="parent-div" key={meme.id}>
                    <a style={{"all": "unset"}} href={meme.url}>
                        <div className="media-left">
                            <img className="img-overview" src={meme.img} alt="No image here"/>
                            <div className="media-body">
                                <h5>{meme.title}</h5>
                            </div>
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}

export default Overview;
