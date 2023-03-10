/**
 * References:
 * https://react-bootstrap.github.io/components/navbar/
 * https://www.youtube.com/watch?v=SLfhMt5OUPI
 * https://getbootstrap.com/docs/4.0/layout/media-object/#example
 * https://stackoverflow.com/questions/8919682/remove-all-styling-formatting-from-hyperlinks
 * Endless scroll:
 * https://www.youtube.com/watch?v=xHm6AbNwAw8
 * Sort by Alphabet:
 * https://stackoverflow.com/questions/19259233/sorting-json-by-specific-element-alphabetically
 * Read current URL:
 * https://stackoverflow.com/questions/39823681/read-the-current-full-url-with-react
 * */

import React, {useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../styles/overview.css";


function Overview() {
    const [data, setData] = useState([]);
    const [sort, setSort] = useState('default');
    const [comments, setComments] = useState([]);
    const array = [];

    useEffect(() => {
        const url = window.location.href;
        const suffix = url.substring(url.lastIndexOf('/'), url.length);
        if (suffix === '/') {
            setSort("default");
            fetchPublicMemesSortByDefault();
        } else if (suffix === '/#sort=latest') {
            setSort("latest");
            fetchPublicMemesSortByDate();
        } else if (suffix === '/#sort=title') {
            setSort("title");
            fetchPublicMemesSortByTitle();
        } else if (suffix === '/#sort=latest-1d') {
            setSort("latest-one-day");
            fetchPublicMemesSortByDateInOneDay();
        }
    }, [])

    const handleMeme = () => {
        window.localStorage.setItem("memeFrom", "Overview");
        window.localStorage.setItem("sort", sort);
    }

    const handleDefault = () => {
        setSort("default");
        fetchPublicMemesSortByDefault();
    }

    const handleLatest = () => {
        setSort("latest");
        fetchPublicMemesSortByDate();
    }

    const handleTitle = () => {
        setSort("title");
        fetchPublicMemesSortByTitle();
    }

    const handleLatestOneDay = () => {
        setSort("latest-one-day");
        fetchPublicMemesSortByDateInOneDay();
    }


    const Meme = ({meme}) => {
        return (
            <div id="singlepost" className="parent-div" key={meme.toString()}>
                <a style={{"all": "unset"}} href={meme.url} onClick={handleMeme}>
                    <div className="media-left">
                        <img className="img-overview" src={meme.img} alt="No image here"/>
                        <div className="media-body">
                            <h5>{meme.title}</h5>
                            <span style={{'fontSize': '12px'}}>by {meme.author}</span>
                        </div>
                    </div>
                </a>
            </div>
        );
    }

    const Comment = ({comment}) => {
        return (
            <div key={comment.toString()}>
                {comment.number}
            </div>
        );
    }

    const fetchPublicMemesSortByDefault = () => {
        fetch("http://localhost:3002/memes/get-public-memes")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
                data.map(meme => {
                    getCommentsByUrl(meme.url);
                });
                setComments(array);

                console.log(comments, ", comments");
            });
    }

    const fetchPublicMemesSortByDate = () => {
        fetch("http://localhost:3002/memes/get-public-memes-sort-by-date")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
            });
    }

    const fetchPublicMemesSortByTitle = () => {
        fetch("http://localhost:3002/memes/get-public-memes-sort-by-title")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
            });
    }

    const fetchPublicMemesSortByDateInOneDay = () => {
        fetch("http://localhost:3002/memes/get-public-memes-sort-by-date-in-one-day")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
            });
    }

    const getCommentsByUrl = (url) => {
        fetch(`http://localhost:3002/memes/get-comments-for-a-meme/?url=${url}`)
            .then((res) => res.json())
            .then((data) => {
                array.push({url: url, number: data.length});
                console.log(data, "getCommentsOnOverview");
            });
    }


    return (
        <div>
            <Navbar className="top">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/" onClick={handleDefault}>Default</Nav.Link>
                        <Nav.Link href="/#sort=latest" onClick={handleLatest}>New</Nav.Link>
                        <Nav.Link href="/#sort=title" onClick={handleTitle}>Title</Nav.Link>
                        <NavDropdown
                            title="Sort by"
                            menuVariant="light">
                            <NavDropdown.Item href="/#sort=latest-1d" onClick={handleLatestOneDay}>New <span
                                style={{'fontSize': '13px'}}>past 24h</span></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>

            {sort === "default" && data && data.map(meme =>
                <Meme key={meme.url}
                      meme={meme}
                />
            )}

            {sort === "latest" && data && data.map(meme =>
                <Meme key={meme.url}
                      meme={meme}
                />
            )}

            {sort === "title" && data && data.map(meme =>
                <Meme key={meme.url}
                      meme={meme}
                />
            )}

            {sort === "latest-one-day" && data && data.map(meme =>
                <Meme key={meme.url}
                      meme={meme}
                />
            )}

            <div className="bottom-space"/>
        </div>
    );
}

export default Overview;
