import * as React from 'react';

const SvgValueKpiIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={32} {...props}>
    <g fill="none" fillRule="evenodd">
      <path stroke="#2160F8" d="M.5.5h38.752v31H.5z" />
      <path fill="#8EC1FF" d="M4.969 21.714h21.863v4.571H4.969zm26.832 0 1.988 4.572h-3.975z" />
      <text fill="#2160F8" fontFamily="IBMPlexSans, IBM Plex Sans" fontSize={10}>
        <tspan x={4.969} y={15.5}>
          25%
        </tspan>
      </text>
    </g>
  </svg>
);
export default SvgValueKpiIcon;
