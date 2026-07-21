import React from "react";
import { IconCapture, IconRoute, IconDeliver } from "./icons/PipelineIcons";

export default function Pipeline({ captureActive, routeActive, deliverDone }) {
  return (
    <div className="pipeline" aria-hidden="true">

      <div className={`pipeline-node ${captureActive ? "is-active" : ""}`}>
        <div className="node-ring"><IconCapture /></div>
        <span className="node-label mono">Capture</span>
      </div>

      <div className="pipeline-connector">
        <div className={`connector-fill ${captureActive ? "is-full" : ""}`} />
        <span className="connector-pulse" />
      </div>

      <div className={`pipeline-node ${routeActive ? "is-active" : ""}`}>
        <div className="node-ring"><IconRoute /></div>
        <span className="node-label mono">Route</span>
      </div>

      <div className="pipeline-connector">
        <div className={`connector-fill ${routeActive ? "is-full" : ""}`} />
        <span className="connector-pulse" />
      </div>

      <div className={`pipeline-node ${deliverDone ? "is-done" : ""}`}>
        <div className="node-ring"><IconDeliver /></div>
        <span className="node-label mono">Deliver</span>
      </div>

    </div>
  );
}
