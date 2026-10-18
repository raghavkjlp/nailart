import React from "react";

/**
 * Visual SVG silhouette representations for nail shapes
 */
export const NailShapeIcon = ({ shape, className = "w-10 h-14", color = "currentColor" }) => {
  const norm = (shape || "").toLowerCase();

  if (norm.includes("almond")) {
    return (
      <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 52 C10 42, 8 26, 20 6 C32 26, 30 42, 30 52 C30 55, 27 56, 20 56 C13 56, 10 55, 10 52 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M14 48 C14 36, 12 25, 20 12 C28 25, 26 36, 26 48"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes("square")) {
    return (
      <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 12 L31 12 L31 52 C31 55, 27 56, 20 56 C13 56, 9 55, 9 52 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M13 16 L27 16 L27 48"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes("coffin") || norm.includes("ballerina")) {
    return (
      <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 8 L26 8 L31 50 C31 54, 27 56, 20 56 C13 56, 9 54, 9 50 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M16 12 L24 12 L27 46"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes("oval")) {
    return (
      <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 50 C10 32, 10 10, 20 10 C30 10, 30 32, 30 50 C30 55, 27 56, 20 56 C13 56, 10 55, 10 50 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M14 46 C14 30, 14 16, 20 16 C26 16, 26 30, 26 46"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (norm.includes("stiletto")) {
    return (
      <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 52 C10 42, 12 25, 20 4 C28 25, 30 42, 30 52 C30 55, 27 56, 20 56 C13 56, 10 55, 10 52 Z"
          fill={color}
          opacity="0.9"
        />
        <path
          d="M14 48 C14 36, 15 22, 20 10"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Fallback generic nail silhouette
  return (
    <svg viewBox="0 0 40 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 50 C10 30, 11 12, 20 12 C29 12, 30 30, 30 50 C30 55, 27 56, 20 56 C13 56, 10 55, 10 50 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
};
