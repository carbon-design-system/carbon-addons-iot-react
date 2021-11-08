import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { spacing02 } from '@carbon/layout';

import { settings } from '../../constants/Settings';
import Button from '../Button';
import { COLORS } from '../../styles/styles';
import { handleSpecificKeyDown } from '../../utils/componentUtilityFunctions';
import { keyboardKeys } from '../../constants/KeyCodeConstants';

const { prefix } = settings;

const ResourceListSection = styled.section`
   {
    &.${prefix}--structured-list--selection
      .${prefix}--structured-list-row:hover:not(.${prefix}--structured-list-row--header-row)
      > .${prefix}--structured-list-td {
      border: none;
    }

    .${prefix}--btn {
      display: flex;
      align-items: flex-end;
      margin: auto 0 auto auto;

      svg {
        fill: ${COLORS.blue60};
        margin-left: ${spacing02};
      }
    }
  }
`;

const InlineDiv = styled.div`
   {
    font-weight: normal;
    padding-left: 0px !important;
    padding-top: ${spacing02} !important;
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
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    }),
    /** Current item selected id */
    currentItemId: PropTypes.string,
    /** Extra content element */
    extraContent: PropTypes.arrayOf(PropTypes.node),

    testId: PropTypes.string,
  };

  static defaultProps = {
    design: 'normal',
    onRowClick: () => {},
    currentItemId: null,
    extraContent: null,
    customAction: null,
    testId: 'resource-list',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const {
      design,
      data,
      customAction,
      currentItemId,
      onRowClick,
      extraContent,
      testId,
    } = this.props;

    const checkboxCell = (
      <div className={`${prefix}--structured-list-td`} style={{ verticalAlign: 'middle' }}>
        <svg
          className={`${prefix}--structured-list-svg`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.646-10.854L6.75 10.043 4.354 7.646l-.708.708 3.104 3.103 5.604-5.603-.708-.708z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    );
    const customActionContent = (rowId) => (
      <CustomActionDiv
        className={`${prefix}--structured-list-td ${prefix}--structured-list-content--nowrap`}
        role="presentation"
      >
        <Button
          kind="ghost"
          renderIcon={customAction.icon}
          onClick={() => customAction.onClick(rowId)}
          testId={`${testId}-custom-action-${rowId}`}
        >
          {customAction.label}
        </Button>
      </CustomActionDiv>
    );

    const listContent = data.map(({ id, title, description }, idx) => {
      const activeItem = id === currentItemId;
      return (
        // eslint-disable-next-line jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control, jsx-a11y/no-noninteractive-element-interactions
        <label
          key={id}
          aria-label={title}
          className={`${
            activeItem ? `${prefix}--structured-list-row--selected` : ''
          } ${prefix}--structured-list-row`}
          tabIndex={customAction ? -1 : idx}
          onClick={onRowClick ? () => onRowClick(id) : null}
          onKeyDown={
            onRowClick
              ? handleSpecificKeyDown([keyboardKeys.ENTER], () => onRowClick(id))
              : undefined
          }
          data-testid={`${testId}-row-${id}`}
        >
          {extraContent ? (
            <div className={`${prefix}--structured-list-td`}>{extraContent[idx]}</div>
          ) : undefined}
          {design === 'inline' ? (
            <Fragment>
              <div className={`${prefix}--structured-list-td`}>
                <strong>{title}</strong>
                <InlineDiv className={`${prefix}--structured-list-td`}>{description}</InlineDiv>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div
                className={`${prefix}--structured-list-td ${prefix}--structured-list-content--nowrap`}
              >
                <strong>{title}</strong>
              </div>
              <div className={`${prefix}--structured-list-td`}>{description}</div>
            </Fragment>
          )}
          {customAction ? (
            customActionContent(id)
          ) : (
            <Fragment>
              <input
                tabIndex={-1}
                className={`${prefix}--structured-list-input`}
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
        data-testid={testId}
        className={[
          `${prefix}--structured-list`,
          `${prefix}--structured-list--border`,
          `${prefix}--structured-list--selection`,
        ].join(' ')}
      >
        <div className={`${prefix}--structured-list-tbody`}>{listContent}</div>
      </ResourceListSection>
    );
  };
}

ResourceList.displayName = 'ResourceList';

export default ResourceList;
