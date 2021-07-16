import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import FrequentCasher from "./FrequentCasher";

const FrequentCasherComponent = AuthLayoutHOC(FrequentCasher);

export default FrequentCasherComponent;
