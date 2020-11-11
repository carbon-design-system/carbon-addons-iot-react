/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-A0N
 * © Copyright IBM Corp. 2020
 * The source code for this program is not published or otherwise divested of its
 * trade secrets, irrespective of what has been deposited with the U.S. Copyright
 * Office.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Link from '../Link';
import { settings } from '../../constants/Settings';
import {
  EmptystateError as ErrorImage,
  Emptystate404 as Error404Image,
  EmptystateDefault as EmptyImage,
  EmptystateSuccess as SuccessImage,
  EmptystateNoresults as NoResultImage,
  EmptystateNotauthorized as NotAuthImage,
} from '../../icons/components';

const { iotPrefix } = settings;

const images = {
  error: ErrorImage,
  404: Error404Image,
  empty: EmptyImage,
  'not-authorized': NotAuthImage,
  'no-result': NoResultImage,
  success: SuccessImage,
};

const actionProp = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
]);

const props = {
  /** Title of empty state */
  title: PropTypes.string,
  /** Description of empty state */
  text: PropTypes.string,
  /** Type of state */
  type: PropTypes.oneOf(Object.keys(images)),
  /** Specify actions for container */
  actions: PropTypes.shape({
    button: actionProp,
    link: actionProp,
  }),
  /** Specify an optional className to be applied to the container */
  className: PropTypes.string,
};

const defaultProps = {
  title: 'Please set a state title',
  text: 'Please set a state description',
  actions: {},
  type: 'empty',
  className: '',
};

/**
 * Component to set empty states
 * For reference, visit https://pages.github.ibm.com/ai-applications/design/components/empty-states/usage/
 */
const EmptyState = ({ title, type, text, actions, className }) => (
  <div className={`${iotPrefix}--empty-state ${className}`}>
    <div className={`${iotPrefix}--empty-state--content`}>
      {React.createElement(images[type], {
        className: `${iotPrefix}--empty-state--icon`,
        alt: '',
      })}
      <h3 className={`${iotPrefix}--empty-state--title`}>{title}</h3>
      <p className={`${iotPrefix}--empty-state--text`}>{text}</p>
      {actions && (
        <>
          {actions.button && (
            <div className={`${iotPrefix}--empty-state--action`}>
              {actions.button.label ? (
                <Button
                  onClick={actions.button.onClick && actions.button.onClick}>
                  {actions.button.label}
                </Button>
              ) : (
                actions.button
              )}
            </div>
          )}
          {actions.link && (
            <div className={`${iotPrefix}--empty-state--link`}>
              {actions.link.label ? (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <Link onClick={actions.link.onClick && actions.link.onClick}>
                  {actions.link.label}
                </Link>
              ) : (
                actions.link
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

EmptyState.propTypes = props;
EmptyState.defaultProps = defaultProps;

export default EmptyState;
