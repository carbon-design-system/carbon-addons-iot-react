import React from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

import ValueRenderer from './ValueRenderer';

const AttributeWrapper = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    display: flex;
    padding: 0 ${CARD_CONTENT_PADDING}px;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `}
`;

const AttributeLabel = styled.div`
  ${props => props.layout === CARD_LAYOUTS.HORIZONTAL && `padding-bottom: 0.25rem;`};
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `text-align: left;`};
`;

const AttributeValue = styled.span`
  ${props => props.layout === CARD_LAYOUTS.HORIZONTAL && 'font-size: 300%;'}
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `text-align: right;`};
`;

const AttributeUnit = styled.span`
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    font-size: 200%;  
    color: #aaa;
  `};
`;

const ValueCard = ({ title, content, size, ...others }) => {
  let layout = CARD_LAYOUTS.HORIZONTAL;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.SMALL:
    case CARD_SIZES.TALL:
      if (content.length > 2) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.LARGE:
      if (content.length > 3) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    case CARD_SIZES.WIDE:
    case CARD_SIZES.XLARGE:
      if (content.length > 5) {
        layout = CARD_LAYOUTS.VERTICAL;
      }
      break;

    default:
      break;
  }

  return (
    <Card title={title} size={size} layout={layout} {...others}>
      {content.map(i => (
        <AttributeWrapper layout={layout} key={i.title}>
          <AttributeLabel layout={layout}>{i.title}</AttributeLabel>
          <div>
            <AttributeValue layout={layout}>
              {!isNil(i.value) ? <ValueRenderer value={i.value} /> : ' '}
            </AttributeValue>
            {i.unit && <AttributeUnit layout={layout}>{i.unit}</AttributeUnit>}
          </div>
        </AttributeWrapper>
      ))}
    </Card>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueCardPropTypes };

ValueCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default ValueCard;
