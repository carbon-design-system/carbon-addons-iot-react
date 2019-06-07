import React from 'react';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import { iconCaretUp, iconCaretDown } from 'carbon-icons';

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
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    width: 100%;
  `}
  padding: 0 ${CARD_CONTENT_PADDING}px 8px ${CARD_CONTENT_PADDING}px;
`;

const AttributeValueWrapper = styled.div`
  padding-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Attribute = styled.div`
  max-width: 75%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttributeLabel = styled.div`
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL && `padding-bottom: 0.25rem; font-size: 1.25rem;`};
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `font-size: 1.0rem;`};
  text-align: right;
`;

const AttributeValue = styled.span`
  font-size: ${props => (props.hasSecondary ? '2.5rem' : '3.0rem')};
  font-weight: lighter;
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `text-align: left;`};
  white-space: nowrap;
`;

const AttributeSecondaryValue = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  color: ${props => props.color || '#777'};
  fill: ${props => props.color || '#777'};
  font-size: 0.875rem;
`;

const TrendIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

const AttributeUnit = styled.span`
  padding-left: 0.5rem;
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    font-size: 1.25rem;  
  `};
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
              <AttributeValue
                title={`${i.value} ${i.unit}`}
                layout={layout}
                hasSecondary={i.secondaryValue !== undefined}
              >
                {!isNil(i.value) ? <ValueRenderer value={i.value} /> : ' '}
              </AttributeValue>
              {i.unit && <AttributeUnit layout={layout}>{i.unit}</AttributeUnit>}
            </AttributeValueWrapper>
            {i.secondaryValue !== undefined ? (
              typeof i.secondaryValue === 'object' ? (
                <AttributeSecondaryValue
                  color={i.secondaryValue.color}
                  trend={i.secondaryValue.trend}
                >
                  {i.secondaryValue.trend && i.secondaryValue.trend === 'up' ? (
                    <TrendIcon icon={iconCaretUp} />
                  ) : i.secondaryValue.trend === 'down' ? (
                    <TrendIcon icon={iconCaretDown} />
                  ) : null}
                  {i.secondaryValue.value}
                </AttributeSecondaryValue>
              ) : (
                <AttributeSecondaryValue>{i.secondaryValue}</AttributeSecondaryValue>
              )
            ) : null}
          </AttributeWrapper>
        ) : (
          <AttributeWrapper layout={layout} key={i.title}>
            <Attribute>
              <AttributeValue title={`${i.value} ${i.unit}`} layout={layout}>
                {!isNil(i.value) ? <ValueRenderer value={i.value} /> : ' '}
              </AttributeValue>
              {i.unit && <AttributeUnit layout={layout}>{i.unit}</AttributeUnit>}
            </Attribute>
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
