import React from "react";
import {Button, Col, Form, Modal} from "react-bootstrap";
import './rolemanagement.css';
import EditIcon from "../components/Icons/editIcon";
import AppTextbox from "../AppTextbox/index"
import dotenv from 'dotenv'
import config from "../config";
import PaginatedTable from "../PaginatedTable";
import {UserAction, UserActionCategory} from "../UserActionCategory";
import MyToast from "../MyToast";
import {inject} from "mobx-react";
import {checkRenderPermissions} from "../helpers";
import {permissions} from "../constants";
import ReactTable from "../PaginatedTable/ReactTable";

dotenv.config()

@inject('playerStore', 'authStore')
class AddRole extends React.Component {

    constructor(props) {
        super(props);
    }

    handleInputChange = (event, stateName) => {
        this.props.onInputChange(stateName, event.target.value)
    }


    render() {
        const {roleId, roleName, policies, isEditRole, onCheckboxClick} = this.props;

        const tableHeader = [
            {key: 'category', label: 'Module', width: '25%'},
            {key: 'description', label: 'Policy', width: '30%'},
            {key: 'allowed', label: 'Allowed', width: '25%'}
        ];
        const rowData = policies.map(p => {
            p.allowed = <Form.Check checked={p.isAllowed} onClick={() => onCheckboxClick(p.id)}/>
            return p;
        });

        return (
            <div className='container'>
                <Form>
                    <Form.Row>
                        <Col>
                            <AppTextbox controlId='formGroupRoleName'
                                        placeholder='Role Name'
                                        value={roleName}
                                        onChange={(e) => this.handleInputChange(e, 'roleName')}
                            />
                        </Col>
                    </Form.Row>
                    <ReactTable tableHeader={tableHeader} rowData={rowData} className='edit-role-table'/>
                </Form>

            </div>
        );

    }
}

class RoleManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roleList: [],
            showModal: false,
            selectedId: 0,
            roleId: '',
            roleName: '',
            policies: [],
            isEditRole: false,
            showConfirmPopup: false,
            tableHeader: [
                {key: 'roleid', label: 'Role ID'},
                {key: 'rolename', label: 'Role Name'}
            ],
            showSuccess: false,
            successMessage: '',
            errorMessage: '',
            showError: false
        };
    }

    componentDidMount() {

        // Call API to fetch roles
        this.fetchAllRoles();
    }

    fetchAllRoles = () => {
        fetch(`${config.SERVER_BASE_URL}/v1/users/allroles`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                this.setRoles(res);
            })
            .catch((error) => {
                alert('Error:', error);
            });
    }

    setRoles(response) {
        const roles = response;

        let _tableHeader = JSON.parse(JSON.stringify(this.state.tableHeader));

        if (checkRenderPermissions(permissions.CAN_EDIT_ROLE, JSON.parse(localStorage.getItem('userpolicies')))) {
            if (_tableHeader.findIndex(row => row.key === 'edit') === -1) {
                _tableHeader.push({key: 'edit', label: 'Edit'});
            }
            roles.forEach(role => role.edit =
                <EditIcon color='#FFFFFF' onclick={() => this.handleEditRole(role.roleid, role.rolename)}/>)
        }

        this.setState({roleList: roles, tableHeader: _tableHeader});
    }


    showAddUserModal = () => {
        this.setState({
            showModal: true,
            isEditRole: false,
            roleId: 0,
            roleName: '',
            policies: '',
        });
    }

    onAddRoleClick = (e) => {
        e.preventDefault();
        const {roleId, roleName, policies, roleList, isEditRole} = this.state;
        const policyIds = policies.filter(policy => policy.isAllowed).map(p => p.id);
        if (isEditRole) {
            const xhrData = {roleid: roleId, policyids: policyIds, rolename: roleName};
            const data = localStorage.getItem('userName');

            const url = `${config.SERVER_BASE_URL}/v1/roles/update`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(xhrData),
            })
                .then(response => response.json())
                .then(res => {
                    this.setState({
                        isEditRole: false,
                        showModal: false,
                        roleName: '',
                        successMessage: res.message,
                        showSuccess: true
                    })
                })
                .catch((error) => {
                    this.setState({errorMessage: error, showError: true})
                });

            fetch(`${config.SERVER_BASE_URL}/v1/users/querypolicies`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: data}),
            })
                .then(response => response.json())
                .then(res => {
                    if (res && res.error) {
                        this.setState({errorMessage: res.error});
                    } else {
                        localStorage.setItem('userpolicies', JSON.stringify(res));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({errorMessage: error.toString()});
                });
        } else {
            const xhrData = {policyids: policyIds, rolename: roleName};
            const url = `${config.SERVER_BASE_URL}/v1/roles/create`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(xhrData),
            })
                .then(res => {
                    this.setState({
                        policies: [],
                        isEditRole: false,
                        showModal: false,
                        roleName: ''
                    }, () => this.fetchAllRoles())
                })
                .catch((error) => {
                    alert('Error:', error);
                });
        }

    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({showModal: false});
    }

    onDelete = (e) => {
        e.preventDefault();
        this.setState({showConfirmPopup: true});
    }

    handleInputChange = (stateName, value) => {
        this.setState({[stateName]: value});
    }
    handleRoleChange = (role) => {
        this.setState({roleId: role.roleId})
    }
    handleEditRole = (roleId, roleName) => {
        const url = `${config.SERVER_BASE_URL}/v1/users/getpoliciesbyroleid?roleid=${roleId}`;
        fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                this.setState({policies: res, isEditRole: true, showModal: true, roleName: roleName, roleId: roleId})
            })
            .catch((error) => {
                this.setState({errorMessage: error, showError: true})
            });
        this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.EDIT_ROLE, roleName);
    }
    cancelDeleteRole = () => {
        this.setState({showConfirmPopup: false});
    }
    deleteRole = () => {
        const {roleId} = this.state;
        //Delete API call

        const xhrData = {roleid: roleId};

        const url = `${config.SERVER_BASE_URL}/v1/roles/delete`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(xhrData),
        })
            .then(response => response.json())
            .then((res) => {
                if (res.error) {
                    this.setState({
                        isEditRole: false, showModal: false, roleName: '', roleId: '', showConfirmPopup: false,
                        errorMessage: res.error, showError: true
                    });
                } else {
                    this.setState({
                        successMessage: res.message, showSuccess: true,
                        isEditRole: false, showModal: false, roleName: '', roleId: '', showConfirmPopup: false
                    }, () => this.fetchAllRoles());
                }

            })
            .catch((error) => {
                this.setState({errorMessage: error, showError: true})
            });

    }

    onCheckboxClick = policyId => {
        let _policies = this.state.policies;
        _policies.forEach(p => delete p.allowed);
        _policies = JSON.parse(JSON.stringify(_policies));
        // const roleId = this.state.roleId;
        // const selectedRole = _rolesList.find(role => role.roleid === roleId);
        const selectedPolicy = _policies.find(policy => policy.id === policyId);
        selectedPolicy.isAllowed = !selectedPolicy.isAllowed;
        this.setState({policies: _policies});
    }
    addRole = () => {
        const url = `${config.SERVER_BASE_URL}/v1/users/allpolicies`;
        fetch(url, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                res.forEach(p => p.isAllowed = false);
                this.setState({policies: res, isEditRole: false, showModal: true, roleName: '', roleId: ''})
            })
            .catch((error) => {
                this.setState({errorMessage: error, showError: true})
            });
    }
    getTableHeader = () => {
        return (
            <div className='role-table-header'>
                <div>Role Management</div>
                {checkRenderPermissions(permissions.CAN_ADD_ROLE, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <Button variant='primary' onClick={this.addRole}>Add Role</Button> : null}
            </div>
        )
    }

    handleToastClose = (stateName) => {
        this.setState({[stateName]: false})
    }

    renderRoleManagement() {

        const {showModal, roleId, roleName, policies, roleList, isEditRole, showConfirmPopup, tableHeader, showSuccess, successMessage, errorMessage, showError} = this.state;
        let isDisabled = true;
        const isOneSelected = policies.findIndex(p => p.isAllowed);
        if (!isEditRole && roleName.trim() && isOneSelected !== -1) {
            isDisabled = false;
        } else if (isEditRole && roleName.trim() && isOneSelected !== -1) {
            isDisabled = false;
        }

        const customHeight = `${window.innerHeight - 162}px`;
        const customStyle = {height: customHeight}

        const _header = this.getTableHeader();
        return (

            <div className='role-management app-center-body'>
                {
                    showSuccess
                        ? <MyToast showToast={showSuccess} message={successMessage} isSuccessMessage={true}
                                   handleClose={() => this.handleToastClose('showSuccess')}/>
                        : null
                }
                {
                    errorMessage && showError
                        ? <MyToast showToast={showError} message={errorMessage} isSuccessMessage={false}
                                   handleClose={() => this.handleToastClose('showError')}/>
                        : null
                }
                <div className='role-management-child'>
                    <ReactTable header={_header} tableHeader={tableHeader} rowData={roleList}
                                handleColumnCLick={this.handleEditRole}/>
                    <Modal size='lg' show={showModal} className={`${showConfirmPopup ? 'hide-user-popup' : ''} role-modal`}>
                        <Modal.Header>
                            <h5>{isEditRole ? 'Edit Role' : 'Add Role'}</h5>
                        </Modal.Header>
                        <Modal.Body>
                            <AddRole
                                roleName={roleName}
                                roleId={roleId}
                                policies={policies}
                                onInputChange={this.handleInputChange}
                                onRoleChange={this.handleRoleChange}
                                isEditRole={isEditRole}
                                onCheckboxClick={this.onCheckboxClick}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            {checkRenderPermissions(permissions.CAN_DELETE_ROLE, JSON.parse(localStorage.getItem('userpolicies'))) && isEditRole ?
                                <Button variant='danger' onClick={(e) => this.onDelete(e)}>Delete Role</Button> : null}
                            <Button variant='secondary' onClick={(e) => this.onCancel(e)}>Cancel</Button>
                            <Button disabled={isDisabled} variant='primary' onClick={(e) => this.onAddRoleClick(e)}>
                                {isEditRole ? 'Update' : 'Add Role'}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showConfirmPopup} className='delete-popup'>
                        <Modal.Header>
                            <strong>Do you really want to delete<br/>{roleName} ?</strong>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.cancelDeleteRole(e)}>No</Button>
                            <Button variant='danger' onClick={(e) => this.deleteRole(e)}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }

    render() {
        let renderObj;

        if (checkRenderPermissions(permissions.CAN_ACCESS_ROLE_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderRoleManagement();
        } else {
            renderObj =
                <h1 class='unauthorized-header'>You do not have permission to view this page! Please contact your System
                    Administrator!</h1>
        }

        return (
            renderObj
        );
    }

}

export default RoleManagement;