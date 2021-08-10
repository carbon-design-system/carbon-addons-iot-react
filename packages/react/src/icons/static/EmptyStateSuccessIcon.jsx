import * as React from 'react';

import { useUniqueId } from '../../hooks/useUniqueId';

function SvgEmptystateSuccessIcon(props) {
  const id = useUniqueId() || 'successIcon';
  return (
    <svg width={80} height={80} {...props}>
      <defs>
        <linearGradient
          x1="0%"
          y1="50%"
          x2="99.938%"
          y2="50%"
          id={`emptystate-Success-icon_svg__a"-${id}`}
        >
          <stop stopColor="#F6F6F6" offset="0%" />
          <stop stopColor="#A9A9A9" offset="56.682%" />
          <stop stopColor="#999" offset="68.111%" />
          <stop stopColor="#C7C7C7" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-44.831%"
          y1="572.588%"
          x2="200.857%"
          y2="162.5%"
          id={`emptystate-Success-icon_svg__b-${id}`}
        >
          <stop stopColor="#7D7D7D" offset="0%" />
          <stop stopColor="#2B2B2B" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="45.931%"
          y1="62.295%"
          x2="60.758%"
          y2="17.126%"
          id={`emptystate-Success-icon_svg__c-${id}`}
        >
          <stop stopColor="#969696" offset=".392%" />
          <stop stopColor="#484848" offset="100%" />
        </linearGradient>
        <linearGradient
          x1="66.95%"
          y1="33.147%"
          x2="33.188%"
          y2="66.447%"
          id={`emptystate-Success-icon_svg__d-${id}`}
        >
          <stop stopColor="#5B5B5B" offset="0%" />
          <stop stopColor="#8B8B8B" offset="100%" />
        </linearGradient>
      </defs>
      <g fillRule="nonzero" fill="none">
        <path
          d="M40.52 60.794V43.206L9.093 61.1l32.599 18.443 32.815-18.687-30.903-17.466V60.794c.02.244-.124.458-.432.641-.288.183-.658.275-1.11.275-.412.02-.771-.061-1.08-.244-.288-.184-.442-.407-.462-.672z"
          fillOpacity={0.129}
          fill="#666"
        />
        <path
          d="M32.167 2.32l-.308.184v-.336l-.34.214V1.069h.031c.062.203.206.376.432.519.309.183.668.264 1.08.244.452 0 .822-.092 1.11-.275.247-.142.39-.305.432-.488v59.815c-.018.207-.162.39-.432.551-.288.183-.658.275-1.11.275-.412.02-.771-.061-1.08-.244-.288-.184-.442-.407-.462-.672V30.84l.4-.214.247-.153V2.321z"
          fill={`url(#emptystate-Success-icon_svg__a-${id})`}
          transform="translate(9)"
        />
        <path
          fill={`url(#emptystate-Success-icon_svg__b-${id})`}
          d="M8.728 12.733l-1.203 3.48 1.203-.671z"
          transform="translate(9)"
        />
        <path
          fill={`url(#emptystate-Success-icon_svg__c-${id})`}
          d="M7.093 16.458h.062l1.203-3.48-5.983 3.419V44.58l4.718-2.717z"
          transform="translate(9)"
        />
        <path
          d="M31.52 30.84l.4-.214V2.473l.247-.152-.308.183L7.402 16.61V44.763L31.52 30.84m-5.891-15.97l2.498 1.069-10.085 15.756-6.292-2.626 2.499-3.94 3.7 1.527c.021.02.052.02.093 0s.072-.06.093-.122l7.494-11.664z"
          fill={`url(#emptystate-Success-icon_svg__d-${id})`}
          transform="translate(9)"
        />
        <path
          d="M37.127 15.939L34.63 14.87l-7.494 11.664c-.021.061-.052.102-.093.122-.041.02-.072.02-.092 0l-3.701-1.526-2.499 3.939 6.292 2.626 10.085-15.756M40.86 2.168l-.34.214-22.791 13.16-1.203.672 1.203-3.481h-.308v-.153l-6.354 3.664v28.183l.309-.183V16.397l5.983-3.42-1.203 3.481h-.062v28.245h.031l.062-.123.216-.153V16.611L40.859 2.504v-.336M43.172.244c-.288-.183-.658-.264-1.11-.244-.412 0-.771.092-1.08.275-.288.183-.442.397-.462.641 0 .061.01.112.03.153.062.203.206.376.432.519.309.183.668.264 1.08.244.452 0 .822-.092 1.11-.275.247-.142.39-.305.432-.488V.916c.02-.265-.124-.489-.432-.672z"
          fill="#FFF"
        />
        <path fill="#6F6F6F" d="M41.167 25.893V2.321l-.246.152v28.153l.246-.153z" />
      </g>
    </svg>
  );
}

export default SvgEmptystateSuccessIcon;
