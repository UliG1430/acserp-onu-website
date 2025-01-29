import React from "react";

const TikTokIcon = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-3"
    >
      {/* Sombra Celeste */}
      <path
        d="M9.5 19c-2.48 0-4.5-2.02-4.5-4.5V10h3v4.5c0 .83.67 1.5 1.5 1.5V19z"
        fill="#25F4EE"
      />
      {/* Sombra Roja */}
      <path
        d="M10.5 20.5c-2.48 0-4.5-2.02-4.5-4.5V9h3v6c0 .83.67 1.5 1.5 1.5V20.5z"
        fill="#FE2C55"
      />
      {/* Logo Base */}
      <path
        d="M14 2h3c0 1.1.9 2 2 2v3c-1.66 0-3.16-.51-4.41-1.39V14c0 3.59-2.91 6.5-6.5 6.5S2 17.59 2 14v-4h4v4c0 1.66 1.34 3 3 3s3-1.34 3-3V2z"
        fill="black"
      />
    </svg>
  );
};

export default TikTokIcon;
