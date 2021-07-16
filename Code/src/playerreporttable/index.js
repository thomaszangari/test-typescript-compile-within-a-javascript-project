import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import PlayerReportTable from "./playerreporttable";
import "react-datepicker/dist/react-datepicker.css";
import {withRouter} from "react-router";

const PlayerReportTableComponent = AuthLayoutHOC(PlayerReportTable);

export default withRouter(PlayerReportTableComponent);