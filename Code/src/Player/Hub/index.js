import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import PlayerHub from "./PlayerHub";

const PlayerHubComponent = AuthLayoutHOC(PlayerHub);

export default PlayerHubComponent;
