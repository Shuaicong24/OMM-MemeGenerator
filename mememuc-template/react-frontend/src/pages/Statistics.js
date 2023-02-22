/**
 * https://recharts.org/en-US/guide/getting-started
 * */

import React, {useEffect, useState} from "react";
import "../styles/api.css";
import {LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts';

function Statistics() {
    const [data, setData] = useState([]);
    const xdata = [{name: '1', uv: 400}, {name: '2', uv: 500},
        {name: '3', uv: 300}, {name: '4', uv: 200},
        {name: '5', uv: 400}, {name: '6', uv: 600},
        {name: '7', uv: 300}, {name: '8', uv: 200},
        {name: '9', uv: 500}, {name: '10', uv: 800},
        {name: '11', uv: 700}, {name: '12', uv: 900}];

    const renderLineChart = (
        <LineChart width={400} height={400} data={xdata}>
            <Line type="monotone" dataKey="uv" stroke="#292933"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
        </LineChart>
    );

    useEffect(() => {
        fetchPublicMemes();
    }, []);

    const fetchPublicMemes = () => {
        fetch("http://localhost:3002/memes/get-public-memes")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data, "getMeme");
            });
    }

    const processDate = () => {
        data.map(meme => {
            const date = new Date();
            date.setTime(meme.date);
        });
    }

    return (
        <div className="api">
            <p className="api_caption">Statistics</p>
            <div className="line"></div>
            {renderLineChart}
            {data.length}
        </div>
    );
}

export default Statistics;