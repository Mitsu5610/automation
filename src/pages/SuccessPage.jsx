import React, { useEffect, useRef, useMemo } from "react";
import { IconCheck } from "../components/icons/PipelineIcons";
import { fireConfetti } from "../utils/confetti";

export default function SuccessPage({ onReset }) {
  const confettiRef = useRef(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (!reducedMotion && confettiRef.current) {
      return fireConfetti(confettiRef.current);
    }
  }, [reducedMotion]);

  return (
    <div className="success-page">
      <div className="success-blobs" aria-hidden="true">
        <span /><span />
      </div>
      <canvas ref={confettiRef} className="confetti-canvas" aria-hidden="true" />

      <div className="success-inner" role="status">
        <div className="success-ring" aria-hidden="true">
          <IconCheck />
        </div>
        <p className="success-label">Request received</p>
        <h1 className="success-title">You're in.</h1>
        <p className="success-body">
          A welcome email is on its way to your inbox and our team
          has already been notified. We'll be in touch shortly.
        </p>
        <button className="btn-secondary" onClick={onReset}>
          Submit another request
        </button>
      </div>
    </div>
  );
}
