import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import AchActivity from "./AchActivity";

const AchActivityComponent = AuthLayoutHOC(AchActivity);

export default AchActivityComponent;