import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import ProcessClaimsComponent from "./processClaimsComponent";

const ProcessClaims = AuthLayoutHOC(ProcessClaimsComponent);
export default ProcessClaims;
