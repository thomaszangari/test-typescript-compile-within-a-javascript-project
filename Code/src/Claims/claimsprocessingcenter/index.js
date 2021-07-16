import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimProcessingCenter from "./ClaimProcessingCenter";

const ClaimProcessingCenterComponent = AuthLayoutHOC(ClaimProcessingCenter);

export default ClaimProcessingCenterComponent;