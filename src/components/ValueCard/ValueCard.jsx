import React from 'react';
import styled from 'styled-components';
import { SizeMe } from 'react-sizeme';

import { ValueCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_LAYOUTS, CARD_SIZES, CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { COLORS } from '../../styles/styles';
import Card from '../Card/Card';

import Attribute from './Attribute';

const AttributeWrapper = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    ` 
    padding: 0 ${CARD_CONTENT_PADDING}px;
    width: 100%;
    
  `}
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    width: 100%;
  `}
  padding: 0px ${CARD_CONTENT_PADDING}px  ;
`;

const AttributeBorder = styled.div`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};
  align-items: ${props => (props.isVertical ? 'flex-start' : 'flex-end')};
  justify-content: space-between;
  ${props => props.hasBorder && `border-top: 1px solid ${COLORS.lightGrey}`};
  ${props => (!props.isVertical ? `padding: ${(CARD_CONTENT_PADDING * 2) / 3}px 0px` : '')};
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
  ${props => props.isVertical && `padding-bottom: 0.25rem; padding-top: 0.25rem;`};
  ${props => !props.isVertical && `padding-left: 0.5rem`};
  order: ${props => (props.isVertical ? 0 : 2)};
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
    <SizeMe>
      {({ size: measuredSize }) => {
        const isVertical = measuredSize && measuredSize.width < 300;
        return (
          <Card
            title={title}
            size={size}
            layout={layout}
            availableActions={availableActions}
            isEmpty={content.length === 0}
            {...others}
          >
            {content.map((attribute, i) =>
              isXS ? (
                // Small card
                <AttributeWrapper
                  layout={layout}
                  hasSecondary={attribute.secondaryValue !== undefined}
                  key={attribute.title}
                >
                  <AttributeValueWrapper>
                    <Attribute layout={layout} {...attribute} />
                  </AttributeValueWrapper>
                </AttributeWrapper>
              ) : (
                // Larger card
                <AttributeWrapper
                  layout={layout}
                  key={attribute.title}
                  hasSecondary={attribute.secondaryValue !== undefined}
                >
                  <AttributeBorder isVertical={isVertical} hasBorder={!isVertical && i > 0}>
                    <Attribute layout={layout} {...attribute} />
                    <AttributeLabel isVertical={isVertical} layout={layout}>
                      {attribute.title}
                    </AttributeLabel>
                  </AttributeBorder>
                </AttributeWrapper>
              )
            )}
          </Card>
        );
      }}
    </SizeMe>
  );
};

ValueCard.propTypes = { ...CardPropTypes, ...ValueCardPropTypes };

ValueCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default ValueCard;
