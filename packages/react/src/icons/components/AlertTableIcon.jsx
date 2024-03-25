import * as React from 'react';

const SvgAlertTableIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={40}
    height={32}
    {...props}
  >
    <defs>
      <path
        id="alert-table-icon_svg__a"
        d="m14.94 13.26-6.5-12a.5.5 0 0 0-.88 0l-6.5 12a.5.5 0 0 0 0 .5.5.5 0 0 0 .44.24h13a.5.5 0 0 0 .44-.74"
      />
      <path
        id="alert-table-icon_svg__b"
        d="M8 10.5A.75.75 0 1 1 8 12a.75.75 0 0 1 0-1.5m.565-4.995v4H7.44v-4z"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="#0058FF" d="M0 0h40v2.759H0z" />
      <path stroke="#005BFF" d="M.5 3.259h39V31.5H.5z" />
      <path
        fill="#D8D8D8"
        d="M3.5 6.621h19V9.38h-19zm21.5 0h11V9.38H25zM3.5 18.759h19v2.759h-19zm0-6.069h19v2.759h-19zm21.5 0h11v2.759H25zM3.5 24.828h19v2.759h-19z"
      />
      <g transform="translate(21 13.714)">
        <use xlinkHref="#alert-table-icon_svg__a" fill="#0F62FE" />
        <use xlinkHref="#alert-table-icon_svg__b" fill="#FFF" />
      </g>
    </g>
  </svg>
);
export default SvgAlertTableIcon;
