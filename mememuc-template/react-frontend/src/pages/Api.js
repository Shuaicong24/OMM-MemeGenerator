/**
 * Draw a line:
 * https://codepen.io/chriscoyier/pen/mdPGLGO
 * Table:
 * https://www.npmjs.com/package/react-table
 * https://codesandbox.io/s/tannerlinsley-react-table-basic-ewm82
 * Unicode:
 * https://www.rapidtables.com/code/text/unicode-characters.html
 * */

import React, {useMemo} from "react";
import "../styles/api.css";
import {useTable} from 'react-table';

function Api() {
    const columns = useMemo(
        () => [
            {
                Header: 'Key',
                accessor: 'key',
            },
            {
                Header: 'Value',
                accessor: 'value',
            },
        ], []);
    const data = [{key: 'url', value: "single view url, no need to convert symbol '/' to '\\/'"}]

    function Table({columns, data}) {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({
            columns,
            data,
        })

        return (
            <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    return (
        <div className="api">
            <div>
                <p className="api_caption">API</p>
                <div className="line"></div>
                <p className="text">Some examples of api available are listed below. It is possible to send a request to
                    the server with a specific url with or without parameters and get the result.</p>
            </div>
            <div>
                <p className="title">/get-meme</p>
                <p className="text">
                    Get a specific meme and its information by a unique identifier.
                </p>
                <p className="text">
                    URL: http://localhost:3002/apis/get-meme
                    <br/>
                    Method: GET
                    <br/>
                </p>
                <p className="bold-text">Input Parameters:</p>
                <Table columns={columns} data={data}/>
                <p className="bold-text">Example Success Response:</p>
                <p className="text">
                    {'\u007B'}<br/>
                    <span className="a-span">"success"{'\u003A'}true,</span><br/>
                    <span className="a-span">
                        "data"{'\u003A'}{'\u005B'}{'\u007B'}<br/>
                    </span>
                    <span className="b-span">
                        "_id"{'\u003A'}"63f3cf650b882207837c502f",<br/>
                    </span>
                    <span className="b-span">
                        "title"{'\u003A'}"vsdvds",<br/>
                    </span>
                    <span className="b-span">
                        "url"{'\u003A'}"http://localhost:3000/m/1676922725838",<br/>
                    </span>
                    <span className="b-span">
                        "img"{'\u003A'}"http://localhost:3002/memes/1676922725848.jpg",<br/>
                    </span>
                    <span className="b-span">
                        "date"{'\u003A'}"1676922725851",<br/>
                    </span>
                    <span className="b-span">
                        "author"{'\u003A'}"123",<br/>
                    </span>
                    <span className="b-span">
                        "permission"{'\u003A'}"public",<br/>
                    </span>
                    <span className="b-span">
                        "__v"{'\u003A'}0<br/>
                    </span>
                    <span className="a-span">
                        {'\u007D'}{'\u005D'}<br/>
                    </span>
                    {'\u007D'}
                </p>
                <p className="text">
                    {'\u007B'}<br/>
                    <span className="a-span">"success"{'\u003A'}true,</span><br/>
                    <span className="a-span">
                        "data"{'\u003A'}{'\u005B'}{'\u005D'}<br/>
                    </span>
                    {'\u007D'}
                </p>
                <p className="bold-text">Example Failure Response:</p>
                <p className="text">
                    {'\u007B'}<br/>
                    <span className="a-span">"success"{'\u003A'}false,</span><br/>
                    <span className="a-span">
                        "error_message"{'\u003A'}
                        "Please enter something as value for parameter url."
                    </span><br/>
                    {'\u007D'}
                </p>
            </div>
        </div>
    );
}

export default Api;