import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InlineLoading } from 'carbon-components-react';

import { CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { CardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';

const GaugeCard = ({
  id,
  title,
  size,
  data,
  isLoading,
  loadData,
  hasMoreData,
  layout,
  className,
  ...others
}) => {
  const handleScroll = e => {
    const element = e.target;
    //  height of the elements content - height element’s content is scrolled vertically === height of the scrollable part of the element
    if (
      element.scrollHeight - element.scrollTop === element.clientHeight &&
      hasMoreData &&
      !isLoading
    ) {
      loadData();
    }
  };

  return (
    <Card id={id} title={title} size={size} onScroll={handleScroll} {...others}>
      <div
        className={classNames('list-card', className)}
        style={{
          paddingTop: 0,
          paddingRight: CARD_CONTENT_PADDING,
          paddingBottom: 0,
          paddingLeft: CARD_CONTENT_PADDING,
        }}
      >
        <StructuredGaugeWrapper>
          <StructuredGaugeBody>
            {data
              ? data.map(item => {
                  return (
                    <StructuredGaugeRow key={item.id}>
                      <StructuredGaugeCell className="list-card--item" key={`${item.id}-cell`}>
                        <div className="list-card--item--value">
                          {item.link ? (
                            <Link style={{ display: 'inherit' }} target="_blank" href={item.link}>
                              {item.value}
                            </Link>
                          ) : (
                            item.value
                          )}
                        </div>
                        {item.extraContent ? (
                          <div className="list-card--item--extra-content">{item.extraContent}</div>
                        ) : null}
                      </StructuredGaugeCell>
                    </StructuredGaugeRow>
                  );
                })
              : null}

            {isLoading ? <InlineLoading description="Loading data..." status="active" /> : null}
          </StructuredGaugeBody>
        </StructuredGaugeWrapper>
      </div>
    </Card>
  );
};

GaugeCard.propTypes = {
  ...CardPropTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      link: PropTypes.string,
      extraContent: PropTypes.element,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  hasMoreData: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  layout: PropTypes.string,
};

GaugeCard.defaultProps = {
  isLoading: false,
  hasMoreData: false,
  layout: '',
};

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
