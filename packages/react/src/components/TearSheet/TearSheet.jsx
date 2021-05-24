import React from 'react';
import PropTypes from 'prop-types';
import { Close16 } from '@carbon/icons-react';

import Button from '../Button';

const propTypes = {
  /** Index of the active tear sheet provided by TearSheetWrapper */
  idx: PropTypes.number,
  /** Tear sheet title */
  title: PropTypes.string,
  /** Tear sheet description */
  description: PropTypes.string,
  /** Extra content under description */
  headerExtraContent: PropTypes.node,
  /** Additional classNames to be provided for TearSheet component */
  className: PropTypes.string,
  /** onClose optional function. When provided, it will run when the TearSheet is closed */
  onClose: PropTypes.func,
  /** closeAllTearSheets function is provided via TearSheetWrapper component. It should't be overridden */
  closeAllTearSheets: PropTypes.func.isRequired,
  /** openNextSheet function is provided by TearSheetWrapper component and it shouldn't be overriden. This function can be accessed via children prop to open the next sheet */
  openNextSheet: PropTypes.func.isRequired,
  /** goToPreviousSheet function is provided by TearSheetWrapper component and it shouldn't be overriden. This function can be accessed via children prop to go back to the previous sheet or close the current one if its index is 0 */
  goToPreviousSheet: PropTypes.func.isRequired,
  /** i18n messages */
  i18n: PropTypes.shape({
    close: PropTypes.string,
  }),
  /** children prop can be a node or a funcion. If it is a function, the following props are passed from TearSheetWrapper: idx, openNextSheet, goToPreviousSheet, closeAllTearSheets  */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const defaultProps = {
  idx: undefined,
  title: 'Title',
  description: 'Description',
  headerExtraContent: null,
  className: undefined,
  onClose: undefined,
  i18n: {
    close: 'Close',
  },
  children: undefined,
};

const TearSheet = ({
  idx,
  title,
  description,
  headerExtraContent,
  className,
  onClose,
  closeAllTearSheets,
  openNextSheet,
  goToPreviousSheet,
  i18n,
  children,
}) => {
  const onCloseButton = () => {
    if (onClose) {
      onClose();
      goToPreviousSheet();
    } else {
      goToPreviousSheet();
    }
  };
  return (
    <div data-testid={`iot-tear-sheet-${idx}`} className={`iot-tear-sheet ${className || ''}`}>
      <div
        className={`iot-tear-sheet--header ${
          headerExtraContent ? 'iot-tear-sheet--header__extraContent' : ''
        } `}
      >
        <Button
          hasIconOnly
          kind="ghost"
          renderIcon={Close16}
          iconDescription={i18n.close}
          tooltipAlignment="end"
          tooltipPosition="bottom"
          onClick={onCloseButton}
          testID={`tearSheetCloseBtn${idx}`}
        />
        <h2>{title}</h2>
        <span className="iot-tear-sheet--header--description">{description}</span>
        {headerExtraContent}
      </div>

      <div className="iot-tear-sheet--content">
        {typeof children === 'function'
          ? children(idx, openNextSheet, goToPreviousSheet, closeAllTearSheets)
          : children}
      </div>
    </div>
  );
};

TearSheet.propTypes = propTypes;
TearSheet.defaultProps = defaultProps;

export default TearSheet;
