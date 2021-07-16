import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import RejectClaim from "./rejectClaim";

const RejectClaimComponent = AuthLayoutHOC(RejectClaim);

export default RejectClaimComponent;