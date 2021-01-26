import * as React from 'react';

function SvgValueKpiIcon(props) {
  return (
    <svg width={40} height={32} {...props}>
      <g fill="none" fillRule="evenodd">
        <path stroke="#2160F8" d="M.5.5h38.752v31H.5z" />
        <path fill="#8EC1FF" d="M4.969 21.714h21.863v4.571H4.969zm26.832 0l1.988 4.572h-3.975z" />
        <text fontFamily="IBMPlexSans, IBM Plex Sans" fontSize={10} fill="#2160F8">
          <tspan x={4.969} y={15.5}>
            {'25%'}
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default SvgValueKpiIcon;
