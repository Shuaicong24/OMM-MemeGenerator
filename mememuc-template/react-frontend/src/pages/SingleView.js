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
    const [data, setData] = useState(null);
    const [memes, setMemes] = useState(null);
    const [memesURL, setMemesURL] = useState([]);
    const [meme, setMeme] = useState(null);
    const [inputValue, setInputValue] = useState('Please comment here...');
    let [dogImage, setDogImage] = useState(null)

    // localhost:3000/m/:id
    const {id} = useParams();
    console.log(id);

    useEffect( () => {
        // fetch("http://localhost:3002/memes/get-memes").then(x =>
        //     x.json().then(response => setData(response.json()))
        // );
        // async function fetchData() {
        //     const fetchData = await fetch("http://localhost:3002/memes/get-memes");
        //     const parsedData = await fetchData.json();
        //     console.log(parsedData, "parsedData");
        //     setData(parsedData);
        //
        //     await parsedData.forEach((x) => {
        //         if (x.url == `http://localhost:3000/m/${id}`) {
        //             setMeme(x);
        //             console.log(meme, 'singleMemeInfo');
        //         }
        //
        //     })
        // }
        // fetchData();
        // .then(x => {
        //         console.log('json', x.json());
        //
        //         x.json().then(response => {
        //         setMemes(response);
        //         console.log(response, "getMemes");
        //         response.forEach((x) => {
        //             if (x.url == `http://localhost:3000/m/${id}`) {
        //                 setMeme(x);
        //                 console.log(meme, 'singleMemeInfo');
        //             }
        //         })
        //     }).catch(error => console.log(error, 'error'));
        // }

        //alert(memes);

        // fetch("https://dog.ceo/api/breeds/image/random")
        //     .then(response => response.json())
        //     // 4. Setting *dogImage* to the image url that we received from the response above
        //     .then(data => setDogImage(data.message))

        fetch("http://localhost:3002/memes/get-memes")
            .then(response => response.json())
            .then(data => setData(data));
    },[])

    // const getMemes = () => {
    //     const url = "http://localhost:3002/memes/get-memes";
    //     fetch(url).then(res => {
    //         console.log("json:", res.json());
    //
    //         res.json().then((data) => {
    //             // setMemes(data);
    //             data.forEach((x) => {
    //                 if (x.url == `http://localhost:3000/m/${id}`) {
    //                     setMeme(x);
    //                     console.log(meme, 'memeInfo');
    //                 }
    //             })
    //             console.log(data, "getMemes")
    //         })
    //     })
    //     // axios.get(url)
    //     //     .then((response) => {
    //     //         const data = response.data;
    //     //        // setMemes(data);
    //     //         data.forEach((x) => {
    //     //             if (x.url == `http://localhost:3000/m/${id}`) {
    //     //                 setMeme(x);
    //     //             }
    //     //         })
    //     //         console.log('Data has been received!!');
    //     //     })
    //     //     .catch(() => {
    //     //         alert('Error retrieving data!!!');
    //     //     });
    //
    //     //alert(memes);
    //    // getSingleMeme();
    // };
    //
    // const getSingleMeme = () => {
    //     alert(memes);
    //     memes.forEach((x) => {
    //         if (x.url == `http://localhost:3000/m/${id}`) {
    //             setMeme(x);
    //         }
    //     })

    //     alert(meme);
    // }

    return (
        <div>
            {dogImage && <img src={dogImage}></img>}
            {data && data.forEach(data => {
                console.log(data.title);
            })}
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
