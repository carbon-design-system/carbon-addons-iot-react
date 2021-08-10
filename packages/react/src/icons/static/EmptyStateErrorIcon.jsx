import * as React from 'react';

import { useUniqueId } from '../../hooks/useUniqueId';

function SvgEmptystateErrorIcon(props) {
  const id = useUniqueId() || 'errorIcon';
  return (
    <svg width={80} height={80} {...props}>
      <defs>
        <linearGradient
          x1="40.83%"
          y1="147.026%"
          x2="53.752%"
          y2="5.476%"
          id={`emptystate-Error-icon_svg__a-${id}`}
        >
          <stop stopColor="#767676" offset="0%" />
          <stop stopColor="#FFF" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="44.373%"
          y1="97.685%"
          x2="66.603%"
          y2="-9.503%"
          id={`emptystate-Error-icon_svg__b-${id}`}
        >
          <stop stopColor="#FFF" offset="0%" />
          <stop stopColor="#FFF" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="45.733%"
          y1="91.053%"
          x2="67.978%"
          y2="-16.135%"
          id={`emptystate-Error-icon_svg__c-${id}`}
        >
          <stop stopColor="#939393" offset="0%" />
          <stop stopColor="#DCDCDC" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-52.354%"
          y1="92.68%"
          x2="72.326%"
          y2="51.331%"
          id={`emptystate-Error-icon_svg__d-${id}`}
        >
          <stop stopOpacity={0.18} offset="0%" />
          <stop stopOpacity={0.05} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="55.034%"
          y1="-24.481%"
          x2="40.155%"
          y2="198.063%"
          id={`emptystate-Error-icon_svg__e-${id}`}
        >
          <stop stopOpacity={0.2} offset="0%" />
          <stop stopOpacity={0.5} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="39.23%"
          y1="121.252%"
          x2="48.628%"
          y2="57.245%"
          id={`emptystate-Error-icon_svg__f-${id}`}
        >
          <stop stopColor="#BEBEBE" offset="0%" />
          <stop stopColor="#D8D8D8" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="6.81%"
          y1="148.311%"
          x2="49.062%"
          y2="26.577%"
          id={`emptystate-Error-icon_svg__g-${id}`}
        >
          <stop stopColor="#CCC" offset="0%" />
          <stop stopColor="#FFF" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="50.263%"
          y1="63.049%"
          x2="50.263%"
          y2="-84.145%"
          id={`emptystate-Error-icon_svg__h-${id}`}
        >
          <stop stopColor="#CCC" offset="2%" />
          <stop stopColor="#EEE" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="9731.507%"
          y1="17393.65%"
          x2="9762.569%"
          y2="17462.12%"
          id={`emptystate-Error-icon_svg__i-${id}`}
        >
          <stop stopColor="#CCC" offset="0%" />
          <stop stopColor="#FFF" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="39.379%"
          y1="-82.789%"
          x2="47.452%"
          y2="18.145%"
          id={`emptystate-Error-icon_svg__j-${id}`}
        >
          <stop stopColor="#828282" offset="0%" />
          <stop stopColor="#C9C9C9" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path
          d="M27.333.84A2.98 2.98 0 0026.18.5a5.153 5.153 0 00-3.013.833A10.747 10.747 0 0020.2 4 15.147 15.147 0 0018 7.76L.933 51.64c-.5 1.25-.773 2.58-.806 3.927a5.06 5.06 0 00.8 2.973c.206.308.466.576.766.793l.134.08c.07.045.144.086.22.12l5.613 3.24a3.093 3.093 0 01-.94-.88 5.04 5.04 0 01-.8-2.78v-.193c.036-1.347.311-2.677.813-3.927l17.06-43.9A15.333 15.333 0 0126 7.273a10.767 10.767 0 012.967-2.606A7.74 7.74 0 0130 4.133a4.547 4.547 0 011.96-.3c.368.03.727.128 1.06.287L27.333.827V.84z"
          fill={`url(#emptystate-Error-icon_svg__a-${id})`}
          transform="translate(14)"
        />
        <path
          d="M28.667 1.587A3.16 3.16 0 0027.84.78a1.467 1.467 0 00-.2-.127l-.113-.06a3.193 3.193 0 00-1.06-.286 4.547 4.547 0 00-1.96.3 7.74 7.74 0 00-1.034.506A10.767 10.767 0 0020.5 3.747a15.333 15.333 0 00-2.2 3.82L1.207 51.447A11.167 11.167 0 00.4 55.373v.194c-.016.984.26 1.952.793 2.78.247.357.567.657.94.88.39.212.819.34 1.26.373a5.007 5.007 0 002.96-.787l34-19.673a10.973 10.973 0 003.007-2.667 14.433 14.433 0 002.173-3.793c.5-1.236.766-2.554.787-3.887a5.207 5.207 0 00-.773-3.006l-16.88-24.2z"
          transform="translate(19.333 3.333)"
          fill={`url(#emptystate-Error-icon_svg__b-${id})`}
        />
        <path
          d="M28.827 1.78A3.16 3.16 0 0028 .973a2 2 0 00-.2-.126l-.113-.06A3.04 3.04 0 0026.627.5a4.547 4.547 0 00-1.96.3 7.74 7.74 0 00-1.034.507 10.767 10.767 0 00-2.966 2.633 15.333 15.333 0 00-2.2 3.82L1.4 51.64a11.34 11.34 0 00-.814 3.927v.193c-.01.985.268 1.951.8 2.78a2.827 2.827 0 002.2 1.253 5.007 5.007 0 002.96-.786l34.027-19.674a10.973 10.973 0 003.007-2.666 14.433 14.433 0 002.173-3.794c.5-1.236.766-2.553.787-3.886A5.207 5.207 0 0045.767 26L28.827 1.78z"
          transform="translate(19.333 3.333)"
          fill={`url(#emptystate-Error-icon_svg__c-${id})`}
        />
        <path
          d="M2.26 18.607c-2.284 1.333-2.284 2.666 0 4l4.513 2.606a6.42 6.42 0 006.867 0l29.887-17.32c2.293-1.333 2.293-2.666 0-4l-4.514-2.56a6.433 6.433 0 00-6.873 0L2.26 18.607z"
          transform="translate(19.333 53.333)"
          fill={`url(#emptystate-Error-icon_svg__d-${id})`}
        />
        <path
          d="M5.333 20a1.507 1.507 0 00-1.26.06l-.253.1c-.199.09-.392.19-.58.3C1.42 21.507.507 22.92.5 24.713v.834c-.08.567.118 1.138.533 1.533l.08.04 1.554.88c.446.24 1.16.08 2.126-.473 1.778-1.04 2.667-2.45 2.667-4.227v-.827a1.847 1.847 0 00-.493-1.533l-.107-.06L5.393 20M.94 3.107v6.786l1.4 9.074 1.593.933 1.907-1.113L7.253 8.053l.014-6.72-1.594-.92L.94 3.107z"
          transform="translate(39.333 17.333)"
          fill={`url(#emptystate-Error-icon_svg__e-${id})`}
        />
        <path
          d="M.127 2.833V9.62l1.413 9.093L3.447 17.6 4.86 6.867V.08z"
          transform="translate(43.333 18)"
          fill={`url(#emptystate-Error-icon_svg__f-${id})`}
        />
        <path
          d="M2.113 10.98V4.193l4.72-2.726L5.267.52.547 3.253v6.787z"
          transform="translate(41.333 16.667)"
          fill={`url(#emptystate-Error-icon_svg__g-${id})`}
        />
        <path
          d="M5.153.333a1.48 1.48 0 00-1 0l-.206.06a6.753 6.753 0 00-.82.414C1.309 1.856.393 3.27.38 5.053v.834c-.001.223.017.446.053.666.034.353.219.674.507.88.453.24 1.167.087 2.14-.473 1.778-1.04 2.667-2.449 2.667-4.227v-.78A1.813 1.813 0 005.24.42L5.153.333z"
          transform="translate(42.667 37.333)"
          fill={`url(#emptystate-Error-icon_svg__h-${id})`}
        />
        <path
          d="M5.28 1.087l.207-.06a1.48 1.48 0 011 0l-1.5-.854A1.513 1.513 0 003.74.22l-.253.113c-.199.09-.393.19-.58.3C1.093 1.68.173 3.1.167 4.887v.78c0 .777.173 1.284.52 1.52l.086.046 1.534.88a1.227 1.227 0 01-.507-.88 3.913 3.913 0 01-.053-.666v-.82c0-1.778.915-3.194 2.746-4.247.253-.155.516-.293.787-.413z"
          transform="translate(41.333 36.667)"
          fill={`url(#emptystate-Error-icon_svg__i-${id})`}
        />
        <path
          d="M2.113.98L.52.06l1.4 9.073 1.593.92z"
          transform="translate(41.333 26.667)"
          fill={`url(#emptystate-Error-icon_svg__j-${id})`}
        />
        <path d="M38.293 46.947l-.193-.087.193.12z" fill="#A8A8A8" />
      </g>
    </svg>
  );
}

export default SvgEmptystateErrorIcon;
