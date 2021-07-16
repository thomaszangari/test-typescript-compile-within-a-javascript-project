import React from "react";
import {Table} from "react-bootstrap";
import './TableComponent.css';

class TableComponent  extends  React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableOffset: 1
        }
    }
    handleNavigation = (e, navId) => {
        e.preventDefault();
        const _off = Number(navId);
        this.setState({tableOffset: _off});
    }
    render() {
        const {tableHeader, rowData, header, handleColumnCLick, children, className} = this.props;
        const totalRows = [];
        const {tableOffset} = this.state;
        const rowCount = rowData.length;
        if(rowCount > 5) {
            const navigationLength = rowData.length / 5;
            for(let i=0; i < navigationLength; i++) {
                totalRows.push(i+1);
            }
        }
        let tableRows = [];
        if(rowCount) {
            const lastIndex = tableOffset * 5;
            const startIndex = lastIndex - 5;
            tableRows = rowData.slice(startIndex, lastIndex)
        }
        let showNext = false;
        let showPrev = false;
        if(rowCount > 25) {
            showNext = true;
            showPrev = true;
        }

        return (
            <div className={`custom-table ${className || ''}`}>
                {header ? <div className='table-header'>{header}</div> : null}
                <div className='my-table'>
                <Table className='app-table' >
                    <thead>
                    <tr>
                        {
                            tableHeader && tableHeader.map(header => {
                                return <th key={header.key}>{header.label}</th>
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>

                    {
                        tableRows && tableRows.map((row, index) => {
                            return <tr key={index}>
                                {
                                    tableHeader.map(column => {
                                        return <td>{row[column.key]}</td>
                                    })
                                }
                            </tr>
                        })
                    }
                    </tbody>
                </Table>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-end">
                        {
                            totalRows.map((r, index) => {
                                return <li
                                    className={`page-item ${index +1 === tableOffset ? 'active': ''}`}
                                    onClick={(e) => this.handleNavigation(e, index+1)}
                                >
                                    <a className="page-link" href="#">
                                        {index+1}
                                    </a>
                                </li>
                            })
                        }
                    </ul>
                </nav>
                </div>
                {
                    children || null
                }
            </div>
        );
    }
}

export default TableComponent;
