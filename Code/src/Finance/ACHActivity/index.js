import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ACHActivity from "./ACHActivity";

const ACHActivityComponent = AuthLayoutHOC(ACHActivity);

export default ACHActivityComponent;