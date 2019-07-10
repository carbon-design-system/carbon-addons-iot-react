import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const ResourceListSection = styled.section`
   {
    &.bx--structured-list--selection
      .bx--structured-list-row:hover:not(.bx--structured-list-row--header-row)
      > .bx--structured-list-td {
      border: none;
    }

    .bx--btn {
      display: flex;
      align-items: flex-end;
      margin: auto 0 auto auto;

      svg {
        fill: ${COLORS.blue60};
        margin-left: 0.25rem;
      }
    }
  }
`;

const InlineDiv = styled.div`
   {
    font-weight: normal;
    padding-left: 0px !important;
    padding-top: 5px !important;
  }
`;

const CustomActionDiv = styled.div`
   {
    vertical-align: middle;
    color: #3e70b2;
    fill: #3e70b2;
  }
`;

class ResourceList extends Component {
  static propTypes = {
    /** Component row design */
    design: PropTypes.oneOf(['normal', 'inline']),
    /** Array of data - table content */
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
    /** Callback for when row is clicked */
    onRowClick: PropTypes.func,
    /** Object for custom action column */
    customAction: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
    }),
    /** Current item selected id */
    currentItemId: PropTypes.string,
    /** Extra content element */
    extraContent: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    design: 'normal',
    onRowClick: () => {},
    currentItemId: null,
    extraContent: null,
    customAction: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { design, data, customAction, currentItemId, onRowClick, extraContent } = this.props;

    const checkboxCell = (
      <div className="bx--structured-list-td" style={{ verticalAlign: 'middle' }}>
        <svg className="bx--structured-list-svg" width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.646-10.854L6.75 10.043 4.354 7.646l-.708.708 3.104 3.103 5.604-5.603-.708-.708z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    );
    const customActionContent = rowId => (
      <CustomActionDiv
        className="bx--structured-list-td bx--structured-list-content--nowrap"
        role="presentation"
      >
        <Button
          kind="ghost"
          renderIcon={customAction.icon}
          onClick={() => customAction.onClick(rowId)}
        >
          {customAction.label}
        </Button>
      </CustomActionDiv>
    );

    const listContent = data.map(({ id, title, description }, idx) => {
      const activeItem = id === currentItemId;
      return (
        <label // eslint-disable-line
          key={id}
          aria-label={title}
          className={`${
            activeItem ? 'bx--structured-list-row--selected' : ''
          } bx--structured-list-row`}
          tabIndex={customAction ? -1 : idx}
          onClick={onRowClick ? () => onRowClick(id) : null}
        >
          {extraContent ? (
            <div className="bx--structured-list-td">{extraContent[idx]}</div>
          ) : (
            undefined
          )}
          {design === 'inline' ? (
            <Fragment>
              <div className="bx--structured-list-td">
                <strong>{title}</strong>
                <InlineDiv className="bx--structured-list-td">{description}</InlineDiv>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="bx--structured-list-td bx--structured-list-content--nowrap">
                <strong>{title}</strong>
              </div>
              <div className="bx--structured-list-td">{description}</div>
            </Fragment>
          )}
          {customAction ? (
            customActionContent(id)
          ) : (
            <Fragment>
              <input
                tabIndex={-1}
                className="bx--structured-list-input"
                value={title}
                type="radio"
                title={title}
                checked={activeItem}
                readOnly
              />
              {checkboxCell}
            </Fragment>
          )}
        </label>
      );
    });

    return (
      <ResourceListSection
        className={[
          'bx--structured-list',
          'bx--structured-list--border',
          'bx--structured-list--selection',
        ].join(' ')}
      >
        <div className="bx--structured-list-tbody">{listContent}</div>
      </ResourceListSection>
    );
  };
}

ResourceList.displayName = 'ResourceList';

export default ResourceList;
