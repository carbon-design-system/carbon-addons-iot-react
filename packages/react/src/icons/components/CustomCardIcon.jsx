import * as React from 'react';

function SvgCustomCardIcon(props) {
  return (
    <svg width={40} height={32} {...props}>
      <g fill="none" fillRule="evenodd">
        <path stroke="#2160F8" d="M.5.5h39v31H.5z" />
        <path fill="#D8D8D8" d="M25 5h11v3H25zm0 6h11v3H25zm0 12h11v3H25zm0-6h11v3H25z" />
        <path
          d="M18.415 19.585l-2.915-2.92V14.5a.5.5 0 00-.145-.355l-5-5a.5.5 0 00-.71 0l-4.5 4.5a.5.5 0 000 .71l5 5a.5.5 0 00.355.145h2.17l2.915 2.92a2.001 2.001 0 002.83-2.83v-.005zM7 13.205l1.145 1.15.71-.71-1.15-1.145.795-.795 2.145 2.15.71-.71L9.205 11l.795-.795 3.295 3.295L9.5 17.295 6.205 14 7 13.205zm10.705 8.5a1 1 0 01-1.41 0l-3.065-3.06a.9.9 0 00-.355-.145h-2.17l-.5-.5L14 14.205l.5.5v2.17a.5.5 0 00.145.35l3.06 3.07a1 1 0 010 1.41z"
          fill="#0F62FE"
        />
      </g>
    </svg>
  );
}

export default SvgCustomCardIcon;
