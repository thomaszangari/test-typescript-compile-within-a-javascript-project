import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import './ReactTable.css';

class ReactTable extends React.Component {

    render() {
        const columns = this.props.tableHeader.map(column => {
            return {
                dataField: column.key,
                text: column.label,
                classes: column.classes || ''
            }
        });
        const products = this.props.rowData;
        const header = this.props.header;
        const noDataMessage = this.props.noDataMessage || 'Table is Empty';
        const indication = () => noDataMessage;

        const sizePerPageRenderer = ({
                                         options,
                                         currSizePerPage,
                                         onSizePerPageChange
                                     }) => (
            <div className="btn-group" role="group">
                {
                    options.map((option) => {
                        const isSelect = currSizePerPage === `${option.page}`;
                        return (
                            <button
                                key={ option.text }
                                type="button"
                                onClick={ () => onSizePerPageChange(option.page) }
                                className={ `btn ${isSelect ? 'btn-secondary' : 'btn-warning'}` }
                            >
                                { option.text }
                            </button>
                        );
                    })
                }
            </div>
        );
        const options = {
            // paginationSize: 5,
            // pageStartIndex: 1,
            // // alwaysShowAllBtns: true, // Always show next and previous button
            // // withFirstAndLast: false, // Hide the going to First and Last page button
            // // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            // nextPageTitle: 'First page',
            // prePageTitle: 'Pre page',
            // firstPageTitle: 'Next page',
            // lastPageTitle: 'Last page',
            // showTotal: false,
            sizePerPageRenderer,
            disablePageTitle: true,
            sizePerPageList: [{
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: '25', value: 25
            }, {
                text: 'All', value: products.length
            }] // A numeric array is also available. the purpose of above example is custom the text
        };
        return (
            <div className='react-table'>
                {header ? <div className='table-header'>{header}</div> : null}
                <BootstrapTable keyField='id'
                            data={ products }
                            columns={ columns }
                            pagination={ paginationFactory(options) }
                            bordered={false}
                            classes={this.props.className}
                            noDataIndication={ indication }
                />
            </div>
        )
    }
}

export default ReactTable;
