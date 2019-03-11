import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'carbon-components-react';
import styled from 'styled-components';

const ResourceListSection = styled.section`
   {
    .bx--structured-list-th {
      padding-left: 16px;
    }

    .bx--structured-list-td {
      padding-left: 16px;
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
      action: PropTypes.func.isRequired,
      actionLabel: PropTypes.string.isRequired,
    }),
    /** Current item selected id */
    currentItemId: PropTypes.string.isRequired,
    /** Extra content element */
    extraContent: PropTypes.element,
  };

  static defaultProps = {
    design: 'normal',
    onRowClick: () => {},
    extraContent: null,
    customAction: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { design, data, customAction, currentItemId, onRowClick, extraContent } = this.props;

    const customActionContent = customAction ? (
      <CustomActionDiv
        className="bx--structured-list-td bx--structured-list-content--nowrap"
        style={{ verticalAlign: 'middle' }}
        onClick={() => customAction.action()}
        role="presentation">
        <span style={{ marginRight: '20px' }}>{customAction.actionLabel}</span>
        <Icon name="edit" width="16" height="16" />
      </CustomActionDiv>
    ) : (
      <div className="bx--structured-list-td" style={{ verticalAlign: 'middle' }}>
        <svg className="bx--structured-list-svg" width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.646-10.854L6.75 10.043 4.354 7.646l-.708.708 3.104 3.103 5.604-5.603-.708-.708z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    );

    const listContent = data.map(({ id, title, description }) => {
      const activeItem = id === currentItemId;
      return (
        <label // eslint-disable-line
          key={id}
          aria-label={title}
          className={`${
            activeItem ? 'bx--structured-list-row--selected' : ''
          } bx--structured-list-row`}
          tabIndex="0"
          onClick={() => onRowClick(id)}>
          {extraContent ? <div className="bx--structured-list-td">{extraContent}</div> : undefined}
          {design === 'inline' ? (
            <Fragment>
              <div className="bx--structured-list-td" style={{ fontWeight: '600' }}>
                {title}
                <InlineDiv className="bx--structured-list-td">{description}</InlineDiv>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div
                className="bx--structured-list-td bx--structured-list-content--nowrap"
                style={{ fontWeight: '600' }}>
                {title}
              </div>
              <div className="bx--structured-list-td">{description}</div>
            </Fragment>
          )}

          <input
            tabIndex="-1"
            className="bx--structured-list-input"
            value={title}
            type="radio"
            name="services"
            title={title}
            checked={activeItem}
            readOnly
          />
          {customActionContent}
        </label>
      );
    });

    return (
      <ResourceListSection
        className="bx--structured-list bx--structured-list--border bx--structured-list--selection"
        data-structured-list>
        <div className="bx--structured-list-tbody">{listContent}</div>
      </ResourceListSection>
    );
  };
}

ResourceList.displayName = 'ResourceList';

export default ResourceList;
