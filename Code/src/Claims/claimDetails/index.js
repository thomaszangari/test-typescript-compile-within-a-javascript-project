import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimDetails from "./ClaimDetails";

const ClaimDetailsComponent = AuthLayoutHOC(ClaimDetails);

export default ClaimDetailsComponent;