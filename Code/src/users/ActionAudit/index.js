import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ActionAudit from "./ActionAudit";

const ActionAuditComponent = AuthLayoutHOC(ActionAudit);

export default ActionAuditComponent;