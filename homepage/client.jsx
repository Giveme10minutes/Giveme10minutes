import React from "react";
import { hydrateRoot } from "react-dom/client";
import Homepage from "./Homepage.jsx";

hydrateRoot(document.getElementById("homepage"), <Homepage />);
