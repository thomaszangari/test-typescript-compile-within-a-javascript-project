import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import ClaimPaymentHistory from "./ClaimPaymentHistory";

const ClaimPaymentHistoryComponent = AuthLayoutHOC(ClaimPaymentHistory);

export default ClaimPaymentHistoryComponent;
