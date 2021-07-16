import React from "react";
import {Button, Modal} from "react-bootstrap";
import EditIcon from "../components/Icons/editIcon";
import LockIcon from "../components/Icons/LockIcon";
import UnlockIcon from "../components/Icons/UnlockIcon";
import './usermanagement.css';
import AppTextbox from "../AppTextbox";
import config from "../config";
import ResetPasswordIcon from "../icons/ResetPasswordIcon";
import {checkRenderPermissions} from "../helpers";
import {permissions} from "../constants";
import {UserAction, UserActionCategory} from "../UserActionCategory";
import MyToast from "../MyToast";
import {inject} from "mobx-react";
import ReactTable from "../PaginatedTable/ReactTable";

@inject('playerStore', 'authStore')
class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: []
        }
    }

    handleInputChange = (event, stateName) => {
        this.props.onInputChange(stateName, event.target.value)
    }
    handleRoleChange = (e) => {
        const value = e.target.value;
        this.props.onRoleChange(value);
    }

    render() {
        const {roles, selectedId} = this.state;
        const {rolesList} = this.props;
        const {showEmailError, userName, confirmUserName, lastName, firstName, middleName, role, roleId, isEditUser} = this.props;
        return (
            <div className='container'>
                <AppTextbox controlId='userName'
                            type="email" placeholder='Email' value={userName} disabled={isEditUser}
                            onChange={(e) => this.handleInputChange(e, 'userName')}/>
                {
                    showEmailError ? <div className='invalid-email'>Invalid email</div> : null
                }

                {
                    !isEditUser
                        ? <AppTextbox controlId='confirmUserName' type="text" placeholder='Confirm Email'
                                      value={confirmUserName}
                                      disabled={isEditUser}
                                      onChange={(e) => this.handleInputChange(e, 'confirmUserName')}/>
                        : null
                }


                <AppTextbox controlId='firstName'
                            type="text" placeholder='First Name' value={firstName}
                            onChange={(e) => this.handleInputChange(e, 'firstName')}/>

                {/* <div className="form-group">
                    <input type="text" className="form-control" id="firstName" placeholder="First Name"
                           value={firstName}
                           onChange={(e) => this.handleInputChange(e, 'firstName')}/>
                </div>*/}

                <AppTextbox controlId='middleName'
                            type="text" placeholder='Middle Name' value={middleName}
                            onChange={(e) => this.handleInputChange(e, 'middleName')}/>

                {/*<div className="form-group">
                    <input type="text" className="form-control" id="middleName" placeholder="Middle Name"
                           value={middleName}
                           onChange={(e) => this.handleInputChange(e, 'middleName')}/>
                </div>*/}

                <AppTextbox controlId='lastName'
                            type="text" placeholder='Last Name' value={lastName}
                            onChange={(e) => this.handleInputChange(e, 'lastName')}/>

                {/*<div className="form-group">*/}
                {/*    <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={lastName}*/}
                {/*           onChange={(e) => this.handleInputChange(e, 'lastName')}/>*/}
                {/*</div>*/}
                <select className="form-control user-dropdown" id="role" onChange={(e) => this.handleRoleChange(e)}>
                    <option value=''>Select a Role</option>
                    {
                        rolesList.map((role, index) => {
                            return <option selected={role.roleid === roleId} value={role.roleid} key={index}
                                           id={role.roleid}>{role.rolename}</option>
                        })
                    }
                </select>

            </div>
        );

    }
}

class UserManagement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            role: '',
            userList: [],
            tableHeader: [
                {key: 'id', label: 'User ID'},
                {key: 'username', label: 'User Name'},
                {key: 'rolename', label: 'Role'}
            ],
            showModal: false,
            selectedId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            userName: '',
            roleId: '',
            isEditUser: false,
            showConfirmPopup: false,
            rolesList: [],
            id: '',
            showEmailError: false,
            isValidEmail: false,
            showResetPasswordPopup: false,
            confirmUserName: null,
            selectedUserName: null,
            successMessage: null,
            showSuccess: false,
            showError: false,
            isDeleteProcess: false,
            isDeactivateProcess: false,
            showUnlockModal: false,
            lockedUser: null
        };
    }

    componentDidMount() {

        this.fetchAllUsers();
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
                this.setState({showError: true, errorMessage: error.toString()})
            });
    }

    fetchAllUsers = () => {
        fetch(`${config.SERVER_BASE_URL}/v1/users/allusers`, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                this.setUsers(res);
            })
            .catch((error) => {
                this.setState({showError: true, errorMessage: error.toString()})
            });
    }

    setRoles = (roles) => {
        this.setState({rolesList: roles});
    }

    cancelUnlock = (user) => {
        this.setState({showUnlockModal: false, lockedUser: null});
    }
    showUnlockModal = (user) => {
        this.setState({showUnlockModal: true, lockedUser: user});
    }
    unlockUser = (user) => {
        const {lockedUser} = this.state;
        this.setState({showUnlockModal: false, lockedUser: null},
            () => this.props.playerStore.unlockUser(lockedUser, this.fetchAllUsers)
        );
    }

    setUsers = (users) => {

        const _users = users.filter(user => user.username !== localStorage.getItem('userName'));
        let _tableHeader = JSON.parse(JSON.stringify(this.state.tableHeader));

        if (checkRenderPermissions(permissions.CAN_EDIT_USER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies')))) {
            if (_tableHeader.findIndex(row => row.key === 'edit') === -1) {
                _tableHeader.push({key: 'edit', label: 'Edit'})
            }
            _users.forEach(user => {
                user.edit = <EditIcon color='#FFFFFF' onclick={() => this.handleEditUser(user.username)}/>
            });
        }

        if (checkRenderPermissions(permissions.CAN_RESET_USER_PASSWORD, JSON.parse(localStorage.getItem('userpolicies')))) {
            if (_tableHeader.findIndex(row => row.key === 'password') === -1) {
                _tableHeader.push({key: 'password', label: 'Password'})
            }
            _users.forEach(user => {
                user.password =
                    <ResetPasswordIcon color='#FFFFFF' onclick={() => this.handleResetPassword(user.username)}/>
            });
        }

        if (checkRenderPermissions(permissions.CAN_UNLOCK_USER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies')))) {
            if (_tableHeader.findIndex(row => row.key === 'account') === -1) {
                _tableHeader.push({key: 'account', label: 'Account'});
            }
            _users.forEach(user => {
                user.account = user.islocked ? <LockIcon onclick={() => this.showUnlockModal(user)}/> : <UnlockIcon isDisabled={true}/>;
            });
        }

        if (checkRenderPermissions(permissions.CAN_SEE_USER_AUDIT_ACTIONS, JSON.parse(localStorage.getItem('userpolicies')))) {
            if (_tableHeader.findIndex(row => row.key === 'audit') === -1) {
                _tableHeader.push({key: 'audit', label: 'Audit'})
            }
            _users.forEach(user => {
                user.audit =
                    <a onClick={(e) => this.handleAuditClick(e, user.id, user.username)} href=''
                       className='select-link'>Audit</a>
            });
        }

        this.setState({userList: _users, tableHeader: _tableHeader});
    }

    showAddUserModal = () => {
        this.setState({
            showModal: true,
            isEditUser: false,
            firstName: '',
            lastName: '',
            middleName: '',
            userName: '',
            confirmUserName: '',
            role: '',
            roleId: 0,
        });
    }

    onAddUserClick = (e) => {
        e.preventDefault();
        const {firstName, middleName, lastName, userName, confirmUserName, roleId, isEditUser, id, isValidEmail} = this.state;
        if (!isValidEmail && !isEditUser) {
            this.setState({showEmailError: true});
        } else {

            const newUser = {
                username: userName,
                confirmUserName: confirmUserName,
                roleid: roleId,
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
            };
            let url = `${config.SERVER_BASE_URL}/v1/users/register`;
            if (isEditUser) {
                newUser.id = id;
                url = `${config.SERVER_BASE_URL}/v1/user/update`;
            }
            const message = isEditUser ? 'User updated successfully.' : 'Email with instructions to setup a password is sent to the user'
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
                .then(response => response.json())
                .then(res => {
                    if (res.error) {
                        this.setState({showModal: false, errorMessage: res.error, showError: true})
                    } else {
                        this.setState({
                            isEditUser: false,
                            showModal: false,
                            successMessage: message,
                            showSuccess: true
                        }, () => this.fetchAllUsers());
                    }
                })
                .catch((error) => {
                    this.setState({showError: true, errorMessage: error.toString()})
                });
        }
    }

    onCancel = (e) => {
        e.preventDefault();
        this.setState({showModal: false});
    }

    onDelete = (e) => {
        e.preventDefault();
        this.setState({showConfirmPopup: true, isDeleteProcess: true, isDeactivateProcess: false});
    }
    onDeactivate = (e) => {
        e.preventDefault();
        this.setState({showConfirmPopup: true, isDeleteProcess: false, isDeactivateProcess: true});
    }

    handleInputChange = (stateName, value) => {
        let _isValidEmail = this.state.isValidEmail;
        if (stateName === 'userName') {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                _isValidEmail = true;
            } else {
                _isValidEmail = false
            }
        }
        this.setState({[stateName]: value, isValidEmail: _isValidEmail, showEmailError: false});
    }

    handleRoleChange = (role) => {
        this.setState({roleId: role})
    }


    resetPassword = (e) => {
        // CALL RESET API /v1/users/resetpassword
        e.preventDefault();
        const data = {username: this.state.selectedUserName};
        fetch(`${config.SERVER_BASE_URL}/v1/users/resetpassword`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(res => {
                if (res && res.error) {
                    this.setState({errorMessage: res.error, showError: true});
                } else {
                    this.setState({
                        showSuccess: true,
                        successMessage: 'Email has been sent with instructions to reset the password.'
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({errorMessage: error.toString(), showError: true});
            });
        this.setState({showResetPasswordPopup: false, selectedUserName: null});
    }
    hideResetPassword = () => {
        this.setState({showResetPasswordPopup: false, selectedUserName: null});
    }
    handleResetPassword = (username) => {
        this.setState({showResetPasswordPopup: true, selectedUserName: username});
    }

    handleAuditClick = (event, userid, username) => {
        event.preventDefault();
        this.props.playerStore.setSelectedBackOfficeUserID(userid);
        this.props.playerStore.setSelectedBackOfficeUserName(username);
        this.props.history.push(`/user/audit/${userid}`);
    }

    handleEditUser = (username) => {

        const selectedUser = this.state.userList.find(user => user.username === username);
        if (selectedUser) {
            const {firstname, middlename, lastname, username, roleid, id} = selectedUser;
            this.setState({
                id: id,
                firstName: firstname,
                lastName: lastname,
                middleName: middlename,
                userName: username,
                roleId: roleid,
                showModal: true,
                isEditUser: true,
                successMessage: 'test'
            })
            this.props.playerStore.logAction(UserActionCategory.PAGE_VIEW, UserAction.EDIT_USER, username);
        }
    }
    cancelDeleteUser = () => {
        this.setState({showConfirmPopup: false});
    }
    deleteOrDeactivateUser = () => {

        const {id, isDeactivateProcess, userName} = this.state;
        // let _userList = userList;
        // _userList = _userList.filter(user => user.userName !== userName);
        // this.setState({userList: _userList, showConfirmPopup: false, showModal: false});

        let url = `${config.SERVER_BASE_URL}/v1/user/delete`;
        let method = 'DELETE';
        if (isDeactivateProcess) {
            url = `${config.SERVER_BASE_URL}/v1/users/deactivate`;
            method = 'POST';
        }
        fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userid: id, username: userName}),
        })
            .then(response => response.json())
            .then((res) => {
                if (res.error) {
                    this.setState({isEditUser: false, showModal: false, showConfirmPopup: false});
                } else {
                    this.setState({
                        isEditUser: false,
                        showModal: false,
                        showConfirmPopup: false,
                        successMessage: res.message,
                        showSuccess: true
                    }, () => this.fetchAllUsers());
                }
            })
            .catch((error) => {
                this.setState({showError: true, errorMessage: error.toString()})
            });


    }
    addNewUser = () => {
        this.setState({
            isEditUser: false, showModal: true, firstName: '', middleName: '', lastName: '',
            userName: '', confirmUserName: '', roleId: ''
        });
    }
    getTableHeader = () => {
        return (
            <div className='user-table-header'>
                <div>User Management</div>
                {checkRenderPermissions(permissions.CAN_CREATE_USER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                    <Button variant='primary' onClick={this.addNewUser}>Add User</Button> : null}
            </div>
        )
    }

    handleToastClose = (stateName) => {
        this.setState({[stateName]: false})
    }

    renderUserManagement() {

        const {
            showEmailError, showModal, roleId, role, firstName, middleName, lastName, userName, userList, tableHeader,
            isEditUser, showConfirmPopup, rolesList, showResetPasswordPopup, confirmUserName,
            showSuccess, successMessage, showError, errorMessage, isDeactivateProcess, isDeleteProcess, showUnlockModal,
            lockedUser } = this.state;
        const deleteConfirmMessage =
            <div>{`Do you really want to ${isDeleteProcess ? 'delete' : 'deactivate'}`}<br/>{userName}</div>;
        const resetPasswordConfirmMessage = <div>Are you sure you want to reset this User’s password?</div>;
        let isDisabled = true;
        if (!isEditUser && firstName.trim() && lastName.trim() && userName.trim() && confirmUserName && roleId && userName === confirmUserName) {
            isDisabled = false;
        } else if (isEditUser && firstName.trim() && lastName.trim() && userName && roleId) {
            isDisabled = false;
        }
        const customHeight = `${window.innerHeight - 162}px`;
        const _header = this.getTableHeader();
        const customStyle = {height: customHeight}
        return (
            <div className='user-management app-center-body'>
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
                <div className='user-management-child'>
                    <ReactTable header={_header} tableHeader={tableHeader} rowData={userList}
                                handleColumnCLick={this.handleEditUser} className='fixed_header'/>
                    <Modal show={showModal} className={showConfirmPopup ? 'hide-user-popup' : ''}>
                        <Modal.Header>
                            <h5>{isEditUser ? 'Edit User' : 'Add User'}</h5>
                        </Modal.Header>
                        <Modal.Body>
                            <AddUser
                                userName={userName}
                                confirmUserName={confirmUserName}
                                lastName={lastName}
                                firstName={firstName}
                                middleName={middleName}
                                showEmailError={showEmailError}
                                rolesList={rolesList}
                                role={role}
                                roleId={roleId}
                                onInputChange={this.handleInputChange}
                                onRoleChange={this.handleRoleChange}
                                isEditUser={isEditUser}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            {isEditUser
                                ? <>
                                    {checkRenderPermissions(permissions.CAN_DEACTIVATE_USER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                        <Button variant='warning' onClick={(e) => this.onDeactivate(e)}>Deactivate
                                            User</Button> : null}
                                    {checkRenderPermissions(permissions.CAN_DELETE_USER_ACCOUNT, JSON.parse(localStorage.getItem('userpolicies'))) ?
                                        <Button variant='danger' onClick={(e) => this.onDelete(e)}>Delete
                                            User</Button> : null}
                                </>
                                : null
                            }
                            <Button variant='secondary' onClick={(e) => this.onCancel(e)}>Cancel</Button>
                            <Button disabled={isDisabled} variant='primary' onClick={(e) => this.onAddUserClick(e)}>
                                {isEditUser ? 'Update' : 'Add User'}
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={showConfirmPopup} className='delete-popup'>
                        <Modal.Header>
                            <strong>{deleteConfirmMessage}</strong>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.cancelDeleteUser(e)}>No</Button>
                            <Button disabled={isDisabled} variant='danger'
                                    onClick={(e) => this.deleteOrDeactivateUser(e)}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showResetPasswordPopup} className='reset-password-popup' centered={true}>
                        <Modal.Header>
                            <strong>{resetPasswordConfirmMessage}</strong>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.hideResetPassword(e)}>No</Button>
                            <Button variant='danger' onClick={(e) => this.resetPassword(e)}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showUnlockModal} className='' centered={true}>
                        <Modal.Header>
                            <div>Do you really want to unlock {lockedUser && lockedUser.username}?</div>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={(e) => this.cancelUnlock(e)}>No</Button>
                            <Button variant='primary' onClick={(e) => this.unlockUser(e)}>
                                Yes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }

    render() {
        let renderObj;

        if (checkRenderPermissions(permissions.CAN_ACCESS_USER_MANAGEMENT, JSON.parse(localStorage.getItem('userpolicies')))) {
            renderObj = this.renderUserManagement();
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

export default UserManagement;