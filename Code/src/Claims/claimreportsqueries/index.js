import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimReportsQueries from "./ClaimReportsQueries";

const ClaimReportsQueriesComponent = AuthLayoutHOC(ClaimReportsQueries);

export default ClaimReportsQueriesComponent;