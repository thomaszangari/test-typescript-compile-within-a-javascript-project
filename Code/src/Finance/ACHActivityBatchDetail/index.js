import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ACHActivityBatchDetail from "./ACHActivityBatchDetail";

const ACHActivityBatchDetailComponent = AuthLayoutHOC(ACHActivityBatchDetail);

export default ACHActivityBatchDetailComponent;
