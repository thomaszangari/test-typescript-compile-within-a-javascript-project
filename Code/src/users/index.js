import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import UserManagement from "./usermanagement";

const UserManagementComponent = AuthLayoutHOC(UserManagement);

export default UserManagementComponent;