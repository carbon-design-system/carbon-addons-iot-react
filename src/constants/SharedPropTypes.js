import PropTypes from 'prop-types';

export const OverridePropTypes = PropTypes.shape({
  props: PropTypes.object,
  component: PropTypes.elementType,
});

export const ListTagsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    /** The content of the tag */
    content: PropTypes.string,
    /** The type (normally color, see Tag component) */
    type: PropTypes.string,
  })
);
