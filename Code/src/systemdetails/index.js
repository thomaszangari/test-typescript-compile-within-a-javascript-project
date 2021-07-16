import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import SystemDetails from "./SystemDetails";
import "react-datepicker/dist/react-datepicker.css";
import {withRouter} from "react-router";

const SystemDetailsComponent = AuthLayoutHOC(SystemDetails);

export default withRouter(SystemDetailsComponent);