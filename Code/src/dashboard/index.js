import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import Dashboard from "./Dashboard";

const DashboardComponent = AuthLayoutHOC(Dashboard);

export default DashboardComponent;
