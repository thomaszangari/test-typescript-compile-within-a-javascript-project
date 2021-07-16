import React from "react";
import AuthLayoutHOC from "../../Layout/AuthLayoutHOC";
import PlayerSearchGeneric from "./PlayerSearchGeneric";

const PlayerSearchGenericComponent = AuthLayoutHOC(PlayerSearchGeneric);

export default PlayerSearchGenericComponent;