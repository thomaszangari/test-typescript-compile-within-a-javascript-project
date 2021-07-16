import React from "react";
import {Button} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import config from "../config";
import {ExportToCsv} from 'export-to-csv';
import './playerreporttable.css';
import {UserAction, UserActionCategory} from "../UserActionCategory";
import {inject} from "mobx-react";
import ReactTable from "../PaginatedTable/ReactTable";

@inject('playerStore', 'authStore')
class PlayerReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            tableHeader: []
        }

        var data = [
            {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@test.com',
                enabled: 'Enabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            },
            {
                firstName: 'Test2',
                lastName: 'User',
                email: 'test2@test.com',
                enabled: 'Disabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            },
            {
                firstName: 'Test2',
                lastName: 'User',
                email: 'test2@test.com',
                enabled: 'Disabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            }
        ]


        this.setTableData(data);
    }

    componentDidMount() {
        var data = null;

        if (this.props.location.state == undefined){
            this.props.history.push('/playerreports');
        }
        else
        {
            var query = this.props.location.state.detail;

            let url = `${config.SERVER_BASE_URL}/v1/players/customreports${query}`;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(res => {
                    if (res.error) {
                        console.log(res.error);
                    } else {
                        this.setTableData(res);
                    }
                })
                .then(() => {
                    console.log(data);
                    this.setTableData(data);
                })
                .catch((error) => {
                    this.setState({showError: true, errorMessage: error.toString()})
                });
        }

    }

    options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'User List Export',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    csvExporter = new ExportToCsv(this.options);

    fetchTableData(query) {
        var testData = [
            {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@test.com',
                enabled: 'Enabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            },
            {
                firstName: 'Test2',
                lastName: 'User',
                email: 'test2@test.com',
                enabled: 'Disabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            },
            {
                firstName: 'Test2',
                lastName: 'User',
                email: 'test2@test.com',
                enabled: 'Disabled',
                status: 'Confirmed',
                idcheckresult: 'Pass',
                idchecksource: 'Back Office',
                reason: 'None'
            }
        ]

        let url = `${config.SERVER_BASE_URL}/v1/players/customreports${query}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                if (res.error) {
                    console.log(res.error);
                } else {
                    console.log(res);
                }
            })
            .catch((error) => {
                this.setState({showError: true, errorMessage: error.toString()})
            });
    }

    handleSelectClick = (event, id) => {
        event.preventDefault();
        this.props.history.push(`/comingsoon`);
    }

    getTableHeader = (userList) => {
        return (
            <div className='player-table-header'>
                <div></div>
                <div>
                    <Button className='report-table-btn'
                            onClick={() => this.downloadClicked(userList)}>Download</Button>
                    <Button className='report-table-btn' onClick={() => this.printClicked()}>Print</Button>
                </div>
            </div>
        )
    }

    setTableData = (data) => {
        const rows = data.map((d, index) => {
            d.idField = index + 1;
            d.select = <a onClick={(e) => this.handleSelectClick(e, d.id)} href='' className='select-link'>VIEW</a>;
            return d;
        });
        const tableHeader = [
            {key: 'firstName', label: 'First'},
            {key: 'lastName', label: 'Last'},
            {key: 'email', label: 'email'},
            {key: 'enabled', label: 'Account Locked?'},
            {key: 'status', label: 'Player Identity Status'},
            {key: 'idcheckresult', label: 'Identity Check Result'},
            {key: 'idchecksource', label: 'Identity Check Source'},
            {key: 'reason', label: 'Player Registration Status'},
            {key: 'select', label: ''}
        ];

        //this.setState({tableHeader: tableHeader, userList: rows}, () => console.log(this.state));
        this.state.tableHeader = tableHeader;
        this.state.userList = rows;
    }

    downloadClicked(data) {
        this.props.playerStore.logAction(UserActionCategory.BUTTON_CLICK, UserAction.DOWNLOAD_PLAYER_REPORT);
        this.csvExporter.generateCsv(data);
    }

    printClicked() {
        this.props.playerStore.logAction(UserActionCategory.BUTTON_CLICK, UserAction.PRINT_PLAYER_REPORT);
        // useReactToPrint({content: () => this.state});
    }

    render() {
        //const {firstName, lastName, email} = this.state;

        const {tableHeader, userList} = this.state;
        const _header = this.getTableHeader(userList);

        return (
            <div className='report-container'>
                <ReactTable header={_header} tableHeader={tableHeader} rowData={userList} className='report-table'/>
            </div>
        );
    }

}

export default PlayerReportTable;
