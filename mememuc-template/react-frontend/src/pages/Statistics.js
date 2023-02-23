/**
 * https://recharts.org/en-US/guide/getting-started
 * https://stackoverflow.com/questions/16976062/how-to-get-only-whole-numbers-on-the-y-axis
 * https://recharts.org/en-US/api/Label
 * */

import React, {useEffect, useState} from "react";
import "../styles/api.css";
import {LineChart, Line, XAxis, YAxis, Tooltip, Label} from 'recharts';

function Statistics() {
    const [data, setData] = useState([]);
    const [result, setResult] = useState([]);
    const [isEmpty, setIsEmpty] = useState(-1);
    let array = [];

    const renderLineChart = (
        <LineChart
            width={500}
            height={400}
            data={result}
            margin={{top: 30, right: 15, left: 15, bottom: 15}}>
            <Line type="monotone" dataKey="times" stroke="#292933"/>
            <XAxis dataKey="date">
                <Label value="Date" position="bottom" offset={0}/>
            </XAxis>
            <YAxis allowDecimals={false}
                   label={{value: 'Times', angle: -90, position: 'insideLeft'}}
            />
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
                if (data.length !== 0) {
                    setIsEmpty(1);
                    data.map(data => {
                        const date = new Date();
                        date.setTime(data.date);

                        if (array.length === 0) {
                            array.push({date: date.getMonth() + '-' + date.getDate(), times: 1});
                        } else {
                            let isInArray = false;
                            let index = -1;

                            for (let i = 0; i < array.length; i++) {
                                if (date.getMonth() + '-' + date.getDate() === array[i].date) {
                                    isInArray = true;
                                    index = i;
                                }
                            }

                            if (isInArray === true) {
                                array[index].times++;
                            } else {
                                array.push({date: date.getMonth() + '-' + date.getDate(), times: 1});
                            }

                        }
                    });

                    console.log(array, 'array');
                    setResult(array);
                } else {
                    setIsEmpty(0);
                }
            });
    }

    return (
        <div className="api">
            <div>
                <p className="api_caption">Statistics</p>
                <div className="line"></div>
                <p className="text">Some generated statistical graphs are placed below, each representing different
                    data.</p>
            </div>
            <div>
                <p className="title">A global graph showing uploads over time</p>
                {isEmpty === 0 && <p className="no-data-text">
                    No available data.</p>}
                {isEmpty === 1 && <div className="graph">{renderLineChart}</div>}
            </div>
        </div>
    );
}

export default Statistics;