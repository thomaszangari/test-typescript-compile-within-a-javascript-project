import React from "react";
import {Table} from "react-bootstrap";
import './PaginatedTable.css';

class PaginatedTable  extends  React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableOffset: 1,
            pageCount: 10
        }
    }
    handleNextClick = () => {
        const offset = this.state.tableOffset + 1;
        this.setState({tableOffset: offset});
    }
    handlePrevClick = () => {
        const offset = this.state.tableOffset - 1;
        this.setState({tableOffset: offset});
    }
    handleNavigation = (e, navId) => {
        e.preventDefault();
        const _off = Number(navId);
        this.setState({tableOffset: _off});
    }
    handleSelectChange = (event) => {
        this.setState({pageCount: Number(event.target.value), tableOffset: 1})
    }
    render() {
        const {tableHeader, rowData, header, handleColumnCLick, children, className} = this.props;
        const totalRows = [];
        const {tableOffset, pageCount} = this.state;
        const rowCount = rowData.length;
        if(rowCount > pageCount) {
            const navigationLength = rowData.length / pageCount;
            for(let i=0; i < navigationLength; i++) {
                totalRows.push(i+1);
            }
        }
        let tableRows = [];
        if(rowCount) {
            const lastIndex = tableOffset * pageCount;
            const startIndex = lastIndex - pageCount;
            tableRows = rowData.slice(startIndex, lastIndex)
        }
        let showNext = false;
        let showPrev = false;
        if(rowCount > pageCount * 5) {
            showNext = true;
            showPrev = true;
        }

        return (
            rowData && rowData.length
                ? <div className={`custom-table ${className || ''}`}>
                    <div className='table-header-dropdown'>
                        <label className='table-dropdown-label'>Show</label>
                        <select value={pageCount} onChange={(e) => this.handleSelectChange(e)}>
                            <option value='10' selected={pageCount === 10}>10</option>
                            <option value='25' selected={pageCount === 25}>25</option>
                            <option value='50' selected={pageCount === 50}>50</option>
                            <option value='100' selected={pageCount === 100}>100</option>                            
                            <option value='250' selected={pageCount === 250}>250</option>
                        </select>
                        <label className='table-dropdown-label'>Entries</label>
                    </div>

                    {header ? <div className='table-header'>{header}</div> : null}
                    <Table className='app-table' >
                        <thead>
                        <tr>
                            {
                                tableHeader && tableHeader.map(header => {
                                    return <th key={header.key} style={{width: header.width || '10%'}}>{header.label}</th>
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
                            {totalRows && totalRows.length
                                ?<li className={`page-item ${tableOffset === 1 ? 'disabled' : ''}`}>
                                    <a className="page-link" onClick={this.handlePrevClick}>Previous</a>
                                </li>
                                : null
                            }
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
                            {totalRows && totalRows.length
                                ?<li className={`page-item ${tableOffset === totalRows.length ? 'disabled': ''}`}>
                                    <a className="page-link" onClick={this.handleNextClick}>Next</a>
                                </li>
                                : null
                            }
                        </ul>
                    </nav>

                    {
                        children || null
                    }
                </div>
                : null
        );
    }
}

export default PaginatedTable;
