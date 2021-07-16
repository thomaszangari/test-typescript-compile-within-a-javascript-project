import React from "react";
import AuthLayoutHOC from "../Layout/AuthLayoutHOC";
import PlayerReportsCustom from "./PlayerReportsCustom";

const PlayerReportsCustomComponent = AuthLayoutHOC(PlayerReportsCustom);

export default PlayerReportsCustomComponent;