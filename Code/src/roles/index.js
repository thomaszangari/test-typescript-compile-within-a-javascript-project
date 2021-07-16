import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import RoleManagement from "./rolemanagement";

const RoleManagementComponent = AuthLayoutHOC(RoleManagement);

export default RoleManagementComponent;