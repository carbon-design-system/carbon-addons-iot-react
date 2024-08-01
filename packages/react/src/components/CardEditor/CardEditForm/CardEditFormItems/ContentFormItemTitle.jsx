import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Link } from '@carbon/react';

import { settings } from '../../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  title: PropTypes.string,
  tooltip: PropTypes.shape({
    tooltipText: PropTypes.string,
    href: PropTypes.string,
    linkText: PropTypes.string,
  }),
};

const defaultProps = {
  title: 'Data',
  tooltip: null,
};

const ContentFormItemTitle = ({ title, tooltip }) => {
  const { tooltipText, linkText, href } = tooltip || {};
  return (
    <div className={`${iotPrefix}--card-edit-form--form-section`}>
      {title ? <div>{title}</div> : null}
      <div>
        {tooltip ? (
          <Tooltip
            direction="left"
            triggerId={`card-edit-form-${title}`}
            tooltipId={`card-edit-form-${title}`}
          >
            <p>
              {tooltipText}{' '}
              {href && linkText ? (
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  {linkText}
                </Link>
              ) : null}
            </p>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
};

ContentFormItemTitle.propTypes = propTypes;
ContentFormItemTitle.defaultProps = defaultProps;
export default ContentFormItemTitle;
