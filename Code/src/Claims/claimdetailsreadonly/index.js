import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimDetailsReadOnly from "./ClaimDetailsReadOnly";

const ClaimDetailsReadOnlyComponent = AuthLayoutHOC(ClaimDetailsReadOnly);

export default ClaimDetailsReadOnlyComponent;