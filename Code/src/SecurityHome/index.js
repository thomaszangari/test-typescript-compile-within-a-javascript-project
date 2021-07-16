import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import SecurityHome from "./SecurityHome";

const SecurityHomeComponent = AuthLayoutHOC(SecurityHome);

export default SecurityHomeComponent;
