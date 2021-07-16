import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import SystemStats from "./SystemStats";
import "react-datepicker/dist/react-datepicker.css";
import {withRouter} from "react-router";

const SystemStatsComponent = AuthLayoutHOC(SystemStats);

export default withRouter(SystemStatsComponent);