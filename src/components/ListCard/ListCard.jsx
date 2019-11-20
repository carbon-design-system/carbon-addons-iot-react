import React from 'react';
import {
  InlineLoading,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Link,
} from 'carbon-components-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';

import { CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { CardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';

const StyledSpan = styled.div`
  &&& {
    display: flex;
    flex: 1;
    align-self: center;
    justify-content: flex-end;
  }
`;

const StyledStructuredListCell = styled(StructuredListCell)`
  &&& {
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    max-width: 100%;
  }
`;

const StyledContentWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 0 ${CARD_CONTENT_PADDING}px;
  width: 100%;
  .bx--structured-list {
    min-width: inherit;
  }
`;

const StyledValueSpan = styled.div`
  &&& {
    /* flex: 0 0 200px; */
    flex: 1;
    padding-right: 12px;
  }
`;

const ListCard = ({
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
        className={classNames('contentWrapper', className)}
        style={{
          paddingTop: 0,
          paddingRight: CARD_CONTENT_PADDING,
          paddingBottom: 0,
          paddingLeft: CARD_CONTENT_PADDING,
        }}
      >
        <StructuredListWrapper>
          <StructuredListBody>
            {data
              ? data.map(item => {
                  return (
                    <StructuredListRow key={item.id}>
                      <div className={classNames('cell', className)} key={`${item.id}-cell`}>
                        <div className={classNames('value', className)}>
                          {item.link ? (
                            <Link style={{ display: 'inherit' }} target="_blank" href={item.link}>
                              {item.value}
                            </Link>
                          ) : (
                            item.value
                          )}
                        </div>
                        {item.rightContent ? (
                          <div className={classNames('rightContent', className)}>
                            {item.rightContent ? item.rightContent : null}
                          </div>
                        ) : null}
                      </div>
                    </StructuredListRow>
                  );
                })
              : null}

            {isLoading ? <InlineLoading description="Loading data..." status="active" /> : null}
          </StructuredListBody>
        </StructuredListWrapper>
      </div>
    </Card>
  );
};

ListCard.propTypes = {
  ...CardPropTypes,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      link: PropTypes.string,
      rightContent: PropTypes.element,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  hasMoreData: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  layout: PropTypes.string,
};

ListCard.defaultProps = {
  isLoading: false,
  hasMoreData: false,
  layout: '',
};

ListCard.displayName = 'ListCard';

export default ListCard;
