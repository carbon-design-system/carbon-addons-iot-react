import PropTypes from 'prop-types';

const skeletonLoadingPropTypes = PropTypes.shape({
  className: PropTypes.string,
  heading: PropTypes.bool,
  lineCount: PropTypes.number,
  paragraph: PropTypes.bool,
  width: PropTypes.string,
});

const skeletonLoadingDefaultProps = {
  className: '',
  heading: false,
  lineCount: 0,
  paragraph: false,
  width: '100%',
};

export const ReadOnlyValuePropTypes = {
  type: PropTypes.oneOf(['stacked', 'inline', 'inline_small']),
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
  skeletonLoadingLabel: skeletonLoadingPropTypes,
  skeletonLoadingValue: skeletonLoadingPropTypes,
};

export const ReadOnlyValueDefaultProps = {
  type: 'stacked',
  label: '',
  value: '',
  testId: 'read-only-value',
  isLoading: false,
  skeletonLoadingLabel: skeletonLoadingDefaultProps,
  skeletonLoadingValue: skeletonLoadingDefaultProps,
};
