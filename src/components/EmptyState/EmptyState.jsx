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

import './_emptystate.scss';

const { iotPrefix } = settings;

const images = {
  error: ErrorImage,
  error404: Error404Image,
  empty: EmptyImage,
  'not-authorized': NotAuthImage,
  'no-result': NoResultImage,
  success: SuccessImage,
};

const actionProp = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
]);

const props = {
  /** Title of empty state */
  title: PropTypes.string.isRequired,
  /** Description of empty state */
  body: PropTypes.string.isRequired,
  /** Optional image of state */
  image: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.oneOf([...Object.keys(images), ''])
  ]),
  /** Optional action for container */
  action: actionProp,
  /** Optional secondary action for container */
  secondaryAction: actionProp,
  /** Specify an optional className to be applied to the container */
  className: PropTypes.string,
};

const defaultProps = {
  action: {},
  secondaryAction: {},
  image: '',
  className: '',
};

/**
 * Component to set empty states
 * For reference, visit https://pages.github.ibm.com/ai-applications/design/components/empty-states/usage/
 */
const EmptyState = ({ title, image, body, action, secondaryAction, className }) => (
  <div className={`${iotPrefix}--empty-state ${className}`}>
    <div className={`${iotPrefix}--empty-state--content`}>
      {image && 
        React.createElement(typeof image === 'string' ? images[image] : image, {
          className: `${iotPrefix}--empty-state--icon`,
          alt: '',
        })
      }
      <h3 className={`${iotPrefix}--empty-state--title`}>{title}</h3>
      <p className={`${iotPrefix}--empty-state--text`}>{body}</p>
      {action && (
            <div className={`${iotPrefix}--empty-state--action`}>
              {action.label ? (
                <Button
                  onClick={action.onClick && action.onClick}>
                  {action.label}
                </Button>
              ) : (
                action
              )}
            </div>
          )}
          {secondaryAction && (
            <div className={`${iotPrefix}--empty-state--link`}>
              {secondaryAction.label ? (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <Link onClick={secondaryAction.onClick && secondaryAction.onClick}>
                  {secondaryAction.label}
                </Link>
              ) : (
                secondaryAction
              )}
            </div>
          )}
    </div>
  </div>
);

EmptyState.propTypes = props;
EmptyState.defaultProps = defaultProps;

export default EmptyState;
