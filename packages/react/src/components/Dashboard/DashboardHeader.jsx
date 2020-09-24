import React from 'react';
import PropTypes from 'prop-types';
import { SkeletonText, Button } from 'carbon-components-react';

import icons, { bundledIconNames } from '../../utils/bundledIcons';
import { settings } from '../../constants/Settings';

const { prefix } = settings;

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
      /** used as the description to show for the icon */
      labelText: PropTypes.string,
      /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
      icon: PropTypes.oneOfType([
        PropTypes.oneOf(bundledIconNames),
        PropTypes.shape({
          width: PropTypes.string,
          height: PropTypes.string,
          viewBox: PropTypes.string.isRequired,
          svgData: PropTypes.object.isRequired,
        }),
        PropTypes.object, // Could be a react icon name
        PropTypes.element,
      ]),
      /** Optional custom component */
      customActionComponent: PropTypes.node,
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
              <Button
                className={`${prefix}--btn--icon-only`}
                id={`action-icon--${action.id}`}
                key={action.id}
                onClick={() => onDashboardAction(action.id)}
                kind="ghost"
                title={action.labelText}
                renderIcon={
                  typeof action.icon === 'string' // legacy support for naming the icon by string
                    ? icons[action.icon]
                    : React.isValidElement(action.icon)
                    ? props => React.cloneElement(action.icon, props)
                    : action.icon // alternatively you can pass the
                }
                iconDescription={action.labelText}
              />
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
