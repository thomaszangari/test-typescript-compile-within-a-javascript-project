import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import DailyReconciliationReport from "./DailyReconciliationReport";

const DailyReconciliationReportComponent = AuthLayoutHOC(DailyReconciliationReport);

export default DailyReconciliationReportComponent;
