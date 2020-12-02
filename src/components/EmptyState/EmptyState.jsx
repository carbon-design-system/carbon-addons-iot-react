import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import { Link } from '../Link';
import { settings } from '../../constants/Settings';
import {
  EmptystateErrorIcon as ErrorImage,
  Emptystate404Icon as Error404Image,
  EmptystateDefaultIcon as EmptyImage,
  EmptystateSuccessIcon as SuccessImage,
  EmptystateNoresultsIcon as NoResultImage,
  EmptystateNotauthorizedIcon as NotAuthImage,
} from '../../icons/components';

const { iotPrefix } = settings;

const icons = {
  error: ErrorImage,
  error404: Error404Image,
  empty: EmptyImage,
  'not-authorized': NotAuthImage,
  'no-result': NoResultImage,
  success: SuccessImage,
};

// TODO: Discuss whether actions can be custom components, e.g. for showing details in error messages.
const props = {
  /** Title of empty state */
  title: PropTypes.string.isRequired,
  /** Description of empty state */
  body: PropTypes.string.isRequired,
  /** Optional image of state */
  icon: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf([
      'error',
      'error404',
      'empty',
      'not-authorized',
      'no-result',
      'success',
      '',
    ]),
  ]),
  /** Optional action for container */
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  // action: PropTypes.oneOfType([
  //   PropTypes.func,
  //   PropTypes.shape({
  //     label: PropTypes.string.isRequired,
  //     onClick: PropTypes.func.isRequired,
  //   }),
  // ]),
  /** Optional secondary action for container */
  secondaryAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  // secondaryAction: PropTypes.oneOfType([
  //   PropTypes.func,
  //   PropTypes.shape({
  //     label: PropTypes.string.isRequired,
  //     onClick: PropTypes.func.isRequired,
  //   }),
  // ]),
  /** Specify an optional className to be applied to the container */
  className: PropTypes.string,
  /** Specify a testid for testing this component */
  testID: PropTypes.string,
};

const defaultProps = {
  action: null,
  secondaryAction: null,
  icon: '',
  className: '',
  testID: 'EmptyState',
};

/**
 * Component to set empty states
 * For reference, visit https://pages.github.ibm.com/ai-applications/design/components/empty-states/usage/
 */
const EmptyState = ({
  title,
  icon,
  body,
  action,
  secondaryAction,
  className,
  testID,
}) => (
  <div
    className={`${iotPrefix}--empty-state ${className}`}
    data-testid={testID}>
    <div className={`${iotPrefix}--empty-state--content`}>
      {icon &&
        React.createElement(typeof icon === 'string' ? icons[icon] : icon, {
          className: `${iotPrefix}--empty-state--icon`,
          alt: '',
          'data-testid': `${testID}-icon`,
        })}
      <h3
        className={`${iotPrefix}--empty-state--title`}
        data-testid={`${testID}-title`}>
        {title}
      </h3>
      <p
        className={`${iotPrefix}--empty-state--text`}
        data-testid={`${testID}-body`}>
        {body}
      </p>
      {action && (
        <div
          className={`${iotPrefix}--empty-state--action`}
          data-testid={`${testID}-action`}>
          <Button onClick={action.onClick && action.onClick}>
            {action.label}
          </Button>
          {/* {action.label ? (
            <Button onClick={action.onClick && action.onClick}>
              {action.label}
            </Button>
          ) : (
            action
          )} */}
        </div>
      )}
      {secondaryAction && (
        <div
          className={`${iotPrefix}--empty-state--link`}
          data-testid={`${testID}-secondaryAction`}>
          {secondaryAction.label && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <Link onClick={secondaryAction.onClick && secondaryAction.onClick}>
              {secondaryAction.label}
            </Link>
          )}
          {/* {secondaryAction.label ? (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <Link onClick={secondaryAction.onClick && secondaryAction.onClick}>
              {secondaryAction.label}
            </Link>
          ) : (
            secondaryAction
          )} */}
        </div>
      )}
    </div>
  </div>
);

EmptyState.propTypes = props;
EmptyState.defaultProps = defaultProps;

export default EmptyState;
