/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const defaultProps = {
  lang: 'en',
};

const propTypes = {
  /** Walkme path */
  path: PropTypes.string.isRequired,
  /** Language code */
  lang: PropTypes.string,
};

const Walkme = ({ path, lang }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <script>
          {`window._walkmeConfig = {smartLoad:true};
            window.walkme_get_language = function () {
              return '${lang === 'en' ? '' : lang}';
            }
          `}
        </script>
        <script type="text/javascript" src={path} />
      </Helmet>
    </HelmetProvider>
  );
};

Walkme.defaultProps = defaultProps;
Walkme.propTypes = propTypes;

export default Walkme;
