import React from 'react';
import styled from 'styled-components';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { COLORS } from '../../styles/styles';
import Card from '../Card/Card';

import Attribute from './Attribute';

const AttributeWrapper = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    display: flex;
    padding: 0 ${CARD_CONTENT_PADDING}px;
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  `}
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    width: 100%;
  `}
  padding: 0 ${CARD_CONTENT_PADDING}px ${CARD_CONTENT_PADDING}px ${CARD_CONTENT_PADDING}px;
`;

const AttributeValueWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttributeLabel = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL && `padding-bottom: 0.25rem; font-size: 1.25rem;`};
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `font-size: 1.0rem;`};
  text-align: right;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  color: ${COLORS.gray};
  font-weight: lighter;
`;

const ValueCard = ({ title, content, size, ...others }) => {
  let layout = CARD_LAYOUTS.HORIZONTAL;
  switch (size) {
    case CARD_SIZES.XSMALL:
    case CARD_SIZES.SMALL:
      layout = CARD_LAYOUTS.VERTICAL;
      break;
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

  const availableActions = {
    expand: false,
    ...others.availableActions,
  };

  const isXS = size === CARD_SIZES.XSMALL;

  return (
    <Card
      title={title}
      size={size}
      layout={layout}
      availableActions={availableActions}
      isEmpty={content.length === 0}
      {...others}
    >
      {content.map(i =>
        isXS ? (
          <AttributeWrapper
            layout={layout}
            hasSecondary={i.secondaryValue !== undefined}
            key={i.title}
          >
            <AttributeValueWrapper>
              <Attribute layout={layout} {...i} />
            </AttributeValueWrapper>
          </AttributeWrapper>
        ) : (
          <AttributeWrapper
            layout={layout}
            key={i.title}
            hasSecondary={i.secondaryValue !== undefined}
          >
            <Attribute layout={layout} {...i} />
            <AttributeLabel layout={layout}>{i.title}</AttributeLabel>
          </AttributeWrapper>
        )
      )}
    </Card>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueCardPropTypes };

ValueCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default ValueCard;
