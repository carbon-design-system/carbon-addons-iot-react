import * as React from 'react';

const SvgImageIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={32} {...props}>
    <g fill="none" fillRule="evenodd">
      <path stroke="#0062FF" d="M1.29 21.57 13 10.477l11.2 12.347L30.5 16l8.21 9.6" />
      <ellipse cx={25.835} cy={7.62} stroke="#005BFF" rx={3.19} ry={3.5} />
      <path stroke="#2160F8" d="M.5.5h39v31H.5z" />
    </g>
  </svg>
);
export default SvgImageIcon;
