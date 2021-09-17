import * as React from 'react';

import { useUniqueId } from '../../hooks/useUniqueId';

function SvgEmptystate404Icon(props) {
  const id = useUniqueId() || '404Icon';
  return (
    <svg width={80} height={80} {...props}>
      <defs>
        <linearGradient
          x1="54.837%"
          y1="56.704%"
          x2="34.436%"
          y2="36.281%"
          id={`emptystate-404-icon_svg__a-${id}`}
        >
          <stop stopColor="#5C5C5C" offset="0%" />
          <stop stopColor="#B2B2B2" offset="98%" />
        </linearGradient>
        <linearGradient
          x1="52.286%"
          y1="35.257%"
          x2="20.038%"
          y2="99.807%"
          id={`emptystate-404-icon_svg__b-${id}`}
        >
          <stop stopColor="#D4D4D4" offset="0%" />
          <stop stopColor="#757575" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="36.118%"
          y1="88.863%"
          x2="58.465%"
          y2="81.744%"
          id={`emptystate-404-icon_svg__c-${id}`}
        >
          <stop stopOpacity={0} offset="0%" />
          <stop stopOpacity={0.37} offset="98%" />
        </linearGradient>
        <linearGradient
          x1="-133.356%"
          y1="3308.565%"
          x2="-127.214%"
          y2="3313.015%"
          id={`emptystate-404-icon_svg__d-${id}`}
        >
          <stop stopOpacity={0} offset="0%" />
          <stop stopOpacity={0.37} offset="98%" />
        </linearGradient>
        <linearGradient
          x1="54.886%"
          y1="0%"
          x2="54.886%"
          y2="158.279%"
          id={`emptystate-404-icon_svg__e-${id}`}
        >
          <stop stopOpacity={0} offset="0%" />
          <stop stopOpacity={0.345} offset="47.927%" />
          <stop stopOpacity={0.37} offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path
          d="M.05 22.713l38.714 22.303 38.572-22.303L38.62.409z"
          transform="translate(2.143 27.804)"
          fill={`url(#emptystate-404-icon_svg__a-${id}-${id})`}
        />
        <path
          d="M.036.402l.15 44.607 38.571-22.304z"
          transform="translate(40.714 27.804)"
          fill={`url(#emptystate-404-icon_svg__b-${id})`}
        />
        <path
          d="M0 8.358l10.307 5.94 7.55-2.36L13.871.357z"
          transform="translate(2.143 42.152)"
          fill={`url(#emptystate-404-icon_svg__c-${id})`}
        />
        <path
          d="M16.064 11.945L12.093.365.357 7.175l12.55 34.148 10.236-4.154z"
          transform="translate(25 29.957)"
          fill={`url(#emptystate-404-icon_svg__d-${id})`}
        />
        <path
          d="M9.214 22.022L4.93 24.533l11.914 34.514 6.65 3.838c0-.05 0-.108-.057-.165-1.476-4.381-2.86-8.463-4.15-12.246-4.52-13.2-7.853-22.684-10-28.452h-.072m37.143 47.6l4.357-2.519A5448.833 5448.833 0 0045 50.473C37.605 28.819 32.869 15.24 30.793 9.74l-4.286 2.504 19.85 57.377z"
          fill="#E6E6E6"
        />
        <path
          d="M26.429 12.244L22.07 9.74l21.322 61.574 2.936-1.693-19.9-57.377M4.907 24.533l-4.364-2.51 12.028 34.57 4.286 2.454-11.95-34.514z"
          fill="#A6A6A6"
        />
        <path
          d="M35.557 69.7l3.572 2.059 5.842-3.228-1.221-3.587-8.207 4.734m-15.336-8.666l.329.187-.35-.187m18.571-10.337l-1.221-3.544-16.2 9.369c.38 1.148.785 2.343 1.214 3.587l16.207-9.412m-7.536-22.117L30 24.97l-16.279 9.433c.393 1.127.8 2.296 1.222 3.523l16.278-9.37z"
          fill="#CECECE"
        />
        <path
          d="M32.779 68.2l2.628 1.536 8.329-4.814-2.629-1.5-8.328 4.779m4.728-21.113l-2.621-1.507L20.45 53.89c.279.839.564 1.686.857 2.546l16.2-9.326M12.793 31.822c.293.818.586 1.657.878 2.51L30 24.936 27.343 23.4l-14.55 8.422zM9.186 21.986h.035l-4.335-2.518L.52 21.986l4.365 2.511 4.285-2.51M26.43 7.178L22.064 9.69l4.365 2.518 4.285-2.518-4.285-2.51z"
          fill="#FFF"
        />
        <path
          d="M0 .43l38.729 22.304L77.3.43z"
          transform="translate(2.143 50.043)"
          fill={`url(#emptystate-404-icon_svg__e-${id})`}
        />
      </g>
    </svg>
  );
}

export default SvgEmptystate404Icon;
