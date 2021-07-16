import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import MFAPolicy from "./MFAPolicy";

const MFAPolicyComponent = AuthLayoutHOC(MFAPolicy);

export default MFAPolicyComponent;
