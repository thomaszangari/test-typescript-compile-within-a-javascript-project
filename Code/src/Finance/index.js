import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import Finance from "./Finance";

const FinanceComponent = AuthLayoutHOC(Finance);

export default FinanceComponent;