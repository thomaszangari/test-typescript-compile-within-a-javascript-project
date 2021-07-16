import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimDetailsEditable from "./ClaimDetailsEditable";

const ClaimDetailsEditableComponent = AuthLayoutHOC(ClaimDetailsEditable);

export default ClaimDetailsEditableComponent;