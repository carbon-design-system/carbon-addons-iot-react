import * as React from 'react';

function SvgAlertTableIcon(props) {
  return (
    <svg width={40} height={32} {...props}>
      <defs>
        <path
          d="M14.94 13.26l-6.5-12a.5.5 0 00-.88 0l-6.5 12a.5.5 0 000 .5.5.5 0 00.44.24h13a.5.5 0 00.44-.74z"
          id="alert-table-icon_svg__a"
        />
        <path
          d="M8 10.5A.75.75 0 118 12a.75.75 0 010-1.5zm.565-4.995v4H7.44v-4h1.125z"
          id="alert-table-icon_svg__b"
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
          <use fill="#0F62FE" xlinkHref="#alert-table-icon_svg__a" />
          <use fill="#FFF" xlinkHref="#alert-table-icon_svg__b" />
        </g>
      </g>
    </svg>
  );
}

export default SvgAlertTableIcon;
