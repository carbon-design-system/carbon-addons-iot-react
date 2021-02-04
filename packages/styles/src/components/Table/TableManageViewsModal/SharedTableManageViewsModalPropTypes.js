import PropTypes from 'prop-types';

export const ViewsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    /** The ID of the view  */
    id: PropTypes.string,
    /** True if this view is public, False if private */
    isPublic: PropTypes.bool,
    /** True if this the user can edit this view  */
    isEditable: PropTypes.bool,
    /** True if this the user can delete this view  */
    isDeleteable: PropTypes.bool,
    /** The name of the view */
    title: PropTypes.string,
    /** A string that describes what this view contains */
    description: PropTypes.string,
  })
);
