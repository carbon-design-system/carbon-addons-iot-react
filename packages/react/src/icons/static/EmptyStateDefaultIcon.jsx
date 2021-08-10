import * as React from 'react';

import { useUniqueId } from '../../hooks/useUniqueId';

function SvgEmptystateDefaultIcon(props) {
  const id = useUniqueId() || 'defaultIcon';
  return (
    <svg width={80} height={80} {...props}>
      <defs>
        <linearGradient
          x1="37.502%"
          y1="34.928%"
          x2="55.959%"
          y2="57.808%"
          id={`emptystate-Default-icon_svg__a-${id}`}
        >
          <stop stopOpacity={0.04} offset="0%" />
          <stop stopOpacity={0.04} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-63.062%"
          y1="77.587%"
          x2="101.194%"
          y2="37.496%"
          id={`emptystate-Default-icon_svg__b-${id}`}
        >
          <stop stopColor="#767676" offset="0%" />
          <stop stopColor="#929292" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="73.167%"
          y1="89.948%"
          x2="44.204%"
          y2="39.998%"
          id={`emptystate-Default-icon_svg__c-${id}`}
        >
          <stop stopColor="#969696" offset="0%" />
          <stop stopColor="#E8E8E8" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-23.114%"
          y1="-11.496%"
          x2="57.391%"
          y2="56.197%"
          id={`emptystate-Default-icon_svg__d-${id}`}
        >
          <stop stopColor="#393939" offset="0%" />
          <stop stopColor="#525252" offset="99%" />
        </linearGradient>
        <linearGradient
          x1="5.255%"
          y1="115.2%"
          x2="56.521%"
          y2="40.489%"
          id={`emptystate-Default-icon_svg__e-${id}`}
        >
          <stop stopColor="#9C9C9C" offset="0%" />
          <stop stopColor="#C5C5C5" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="45.625%"
          y1="38.922%"
          x2="61.212%"
          y2="78.234%"
          id={`emptystate-Default-icon_svg__f-${id}`}
        >
          <stop stopColor="#8A8A8A" offset="0%" />
          <stop stopColor="#B5B5B5" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="57.243%"
          y1="31.727%"
          x2="41.531%"
          y2="71.327%"
          id={`emptystate-Default-icon_svg__g-${id}`}
        >
          <stop stopColor="#A4A4A4" offset="0%" />
          <stop stopColor="#BEBEBE" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="27.599%"
          y1="69.394%"
          x2="45.796%"
          y2="53.639%"
          id={`emptystate-Default-icon_svg__h-${id}`}
        >
          <stop stopColor="#C2C2C2" offset="0%" />
          <stop stopColor="#E8E8E8" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="62.356%"
          y1="64.634%"
          x2="31.337%"
          y2="27.889%"
          id={`emptystate-Default-icon_svg__i-${id}`}
        >
          <stop stopColor="#C6C6C6" offset="0%" />
          <stop stopColor="#E8E8E8" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="62.354%"
          y1="114.244%"
          x2="43.81%"
          y2="17.782%"
          id={`emptystate-Default-icon_svg__j-${id}`}
        >
          <stop stopColor="#B7B7B7" offset="0%" />
          <stop stopColor="#EEE" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path
          d="M36.131 27.683c.03.03.065.053.103.069h.042l-.159-.09s0 .02.014.02z"
          fill="#A8A8A8"
        />
        <path
          d="M28.793.593L.041 17.241l28.835 16.697 28.758-16.62z"
          transform="translate(11.724 43)"
          fill={`url(#emptystate-Default-icon_svg__a-${id})`}
        />
        <path
          d="M.069 16.207v24.476L28.062 24.51V.034L.07 16.207z"
          transform="translate(12.414 7.138)"
          fill={`url(#emptystate-Default-icon_svg__b-${id})`}
        />
        <path
          d="M40.455 2.807L27.945.33 0 16.551l12.483 2.477z"
          transform="translate(0 4.38)"
          fill={`url(#emptystate-Default-icon_svg__c-${id})`}
        />
        <path
          d="M27.986.276L0 16.462l28.048 16.241 27.986-16.151z"
          transform="translate(12.414 31.276)"
          fill={`url(#emptystate-Default-icon_svg__d-${id})`}
        />
        <path
          d="M28.434 40.641V16.207L.47.034V24.47l27.965 16.172z"
          transform="translate(40 7.138)"
          fill={`url(#emptystate-Default-icon_svg__e-${id})`}
        />
        <path
          d="M28.476 24.828V.352l-28 16.2v24.482l28-16.206z"
          transform="translate(40 23)"
          fill={`url(#emptystate-Default-icon_svg__f-${id})`}
        />
        <path
          d="M28.062 41.007V16.524L.097.36v24.475l27.965 16.173z"
          transform="translate(12.414 23)"
          fill={`url(#emptystate-Default-icon_svg__g-${id})`}
        />
        <path
          d="M28.517 20.407L40 16.84 11.952.607.469 4.172z"
          transform="translate(40 3)"
          fill={`url(#emptystate-Default-icon_svg__h-${id})`}
        />
        <path
          d="M39.559 10.834L28.524.317.517 16.503l11.076 10.51z"
          transform="translate(40 23)"
          fill={`url(#emptystate-Default-icon_svg__i-${id})`}
        />
        <path
          d="M28.276 31.848l10.227-15.296L10.455.276.235 15.606z"
          transform="translate(2.069 23)"
          fill={`url(#emptystate-Default-icon_svg__j-${id})`}
        />
        <path
          d="M2.303 38.607l.063.041 10.158-15.227 27.966 16.2.082-.104-28.048-16.241z"
          fill="#FFF"
        />
        <path
          d="M68.69 23.503l-.2-.186-27.973 16.186 11.076 10.51.076-.054-10.855-10.345z"
          fill="#FFF"
        />
        <path
          d="M80 19.841l-.159-.09-11.324 3.511-27.89-16.124-.158.055 28.048 16.235z"
          fill="#999"
        />
        <path d="M68.517 23.262h.09L40.614 7.028v-.042l-.131.042 28.034 16.234z" fill="#FFF" />
      </g>
    </svg>
  );
}

export default SvgEmptystateDefaultIcon;
