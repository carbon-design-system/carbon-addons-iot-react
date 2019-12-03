import React from 'react';
import PropTypes from 'prop-types';
import { SkeletonText, Icon } from 'carbon-components-react';

import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';
import icons, { bundledIconNames } from '../../utils/bundledIcons';

const propTypes = {
  /** title of the dashboard */
  title: PropTypes.string,
  /** Optional description of the dashboard */
  description: PropTypes.string,
  /** string that represents the last updated date */
  lastUpdated: PropTypes.string,
  /** i18n label for last updated text */
  lastUpdatedLabel: PropTypes.string,
  /** Optional filter component that might be used to filter this dashboard */
  filter: PropTypes.node,
  /** If the component should render the last updated section */
  hasLastUpdated: PropTypes.bool,
  /** optional actions that will be rendered in the Dashboard header and used in onDashboardAction */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique id of the action */
      id: PropTypes.string.isRequired,
      /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
      icon: PropTypes.oneOfType([
        PropTypes.oneOf(bundledIconNames),
        PropTypes.shape({
          width: PropTypes.string,
          height: PropTypes.string,
          viewBox: PropTypes.string.isRequired,
          svgData: PropTypes.object.isRequired,
        }),
        PropTypes.element,
      ]),
      /** Optional custom component */
      customActionComponent: PropTypes.node,
      labelText: PropTypes.string,
    })
  ),
  /** callback invoked if a dashboard action is clicked */
  onDashboardAction: PropTypes.func,
};

const defaultProps = {
  title: null,
  description: null,
  lastUpdated: null,
  lastUpdatedLabel: 'Last updated:',
  filter: null,
  actions: [],
  onDashboardAction: null,
  hasLastUpdated: true,
};

/** Renders the dashboard header at the top of the dashboard */
const DashboardHeader = ({
  title,
  description,
  lastUpdated,
  lastUpdatedLabel,
  filter,
  hasLastUpdated,
  actions,
  onDashboardAction,
}) => {
  return (
    <div className="dashboard--header">
      <div className="dashboard--header-left">
        {title ? <h2>{title}</h2> : null}
        {description ? <p>{description}</p> : null}
        {hasLastUpdated && lastUpdatedLabel ? (
          <div className="dashboard--lastupdated">
            {lastUpdatedLabel} {lastUpdated || <SkeletonText />}
          </div>
        ) : null}
      </div>
      <div className="dashboard--header-right">
        {filter}
        <div className="dashboard--header-actions">
          {actions.map(action =>
            action.icon ? (
              <div
                id={`action-icon--${action.id}`}
                className="card--toolbar-action"
                key={action.id}
                tabIndex={0}
                role="button"
                onClick={() => onDashboardAction(action.id)}
                onKeyDown={event => handleEnterKeyDown(event, () => onDashboardAction(action.id))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                {typeof action.icon === 'string' ? (
                  <Icon
                    key={`icon-${action.id}`}
                    icon={icons[action.icon]}
                    description={action.labelText}
                  />
                ) : React.isValidElement(action.icon) ? (
                  action.icon
                ) : (
                  <Icon
                    key={`icon-${action.id}`}
                    icon={action.icon}
                    description={action.labelText}
                  />
                )}
              </div>
            ) : (
              React.cloneElement(action.customActionComponent, { key: `icon-${action.id}` })
            )
          )}
        </div>
      </div>
    </div>
  );
};

DashboardHeader.propTypes = propTypes;
DashboardHeader.defaultProps = defaultProps;

export default DashboardHeader;
