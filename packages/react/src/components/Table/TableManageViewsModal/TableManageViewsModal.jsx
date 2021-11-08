import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ComposedModal from '../../ComposedModal/ComposedModal';
import { Checkbox } from '../../Checkbox';
import { Modal } from '../../Modal';
import { Search } from '../../Search';
import { settings } from '../../../constants/Settings';
import { OverridePropTypes } from '../../../constants/SharedPropTypes';
import { SimplePaginationPropTypes } from '../../SimplePagination/SimplePagination';
import deprecate from '../../../internal/deprecate';

import TableManageViewsList from './TableManageViewsList';
import { ViewsPropType } from './SharedTableManageViewsModalPropTypes';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * Callbacks for the actions of the modal
   * onEdit : Called when the user clicks edit on a view row. The ID of the view is passed as argument.
   * onDelete : Called when the user clicks delete on a view row. The ID of the view is passed as argument.
   * onClearError : Called when the dialog error msg is cleared
   * onSearchChange : Called when the search input value is changed, the search term is passed as argument.
   * onDisplayPublicChange : Called when view title input value is changed, a bool value is passed as argument.
   */
  actions: PropTypes.shape({
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onClearError: PropTypes.func,
    onSearchChange: PropTypes.func.isRequired,
    onDisplayPublicChange: PropTypes.func.isRequired,
  }).isRequired,
  /** The ID of the view that should be marked as default if any */
  defaultViewId: PropTypes.string,
  /** True means that the 'display public' checkbox is checked by default */
  displayPublicDefaultChecked: PropTypes.bool,
  /** Shows this string as a general modal error when present */
  error: PropTypes.string,
  /** Internationalisation strings object */
  i18n: PropTypes.shape({
    closeIconDescription: PropTypes.string,
    defaultLabelText: PropTypes.string,
    deleteIconText: PropTypes.string,
    deleteWarningTextTemplate: PropTypes.func,
    deleteWarningCancel: PropTypes.string,
    deleteWarningConfirm: PropTypes.string,
    editIconText: PropTypes.string,
    listTitle: PropTypes.string,
    modalTitle: PropTypes.string,
    privateLabelText: PropTypes.string,
    publicLabelText: PropTypes.string,
    publicCheckboxLabelText: PropTypes.string,
    searchPlaceholderText: PropTypes.string,
    searchClearButtonLabelText: PropTypes.string,
    searchIconLabelText: PropTypes.string,
  }),
  /** Shows loading skeleton and disables pagination when true */
  isLoading: PropTypes.bool,
  /** The default value of the search field value */
  searchValueDefault: PropTypes.string,
  /** Determines if the modal is open or closed (i.e. visible or not to the user) */
  open: PropTypes.bool.isRequired,
  /** Used to overide the internal components and props for advanced customisation */
  overrides: PropTypes.shape({
    mainModal: OverridePropTypes,
    publicCheckbox: OverridePropTypes,
    search: OverridePropTypes,
    tableManageViewsList: OverridePropTypes,
    warningModal: OverridePropTypes,
  }),
  /** pagination at the bottom of list, see SimplePaginationPropTypes */
  pagination: PropTypes.shape(SimplePaginationPropTypes),
  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,
  /** The views to be displayed in the list, see ViewsPropType */
  views: ViewsPropType.isRequired,
};

const defaultProps = {
  defaultViewId: undefined,
  displayPublicDefaultChecked: true,
  error: undefined,
  i18n: {
    closeIconDescription: undefined,
    defaultLabelText: 'default',
    deleteIconText: 'delete',
    deleteWarningTextTemplate: (label) => `You are about to delete view ${label}.`,
    deleteWarningCancel: 'Cancel',
    deleteWarningConfirm: 'Delete',
    editIconText: 'edit',
    listTitle: 'Available Views',
    modalTitle: 'Manage views',
    privateLabelText: 'Private',
    publicLabelText: 'Public',
    publicCheckboxLabelText: 'Display public views',
    searchPlaceholderText: 'Search views',
    searchClearButtonLabelText: 'Clear search input',
    searchIconLabelText: 'Search',
  },
  isLoading: false,
  overrides: undefined,
  searchValueDefault: '',
  testId: 'TableManageViewsModal',
  pagination: undefined,
};

const defaultFunc = () => {};

const TableManageViewsModal = ({
  actions: {
    onEdit = defaultFunc,
    onDelete = defaultFunc,
    onClearError = defaultFunc,
    onClose,
    onSearchChange,
    onDisplayPublicChange,
  },
  defaultViewId,
  displayPublicDefaultChecked,
  error,
  i18n: {
    closeIconDescription,
    deleteWarningTextTemplate,
    deleteWarningCancel,
    deleteWarningConfirm,
    modalTitle,
    publicCheckboxLabelText,
    searchPlaceholderText,
    searchClearButtonLabelText,
    searchIconLabelText,
    ...i18n
  },
  isLoading,
  open,
  overrides,
  pagination,
  searchValueDefault,
  // TODO: remove deprecated 'testID' in v3.
  testID,
  testId,
  views,
}) => {
  const primaryInputId = 'manage-views-modal-search';
  const MyMainModal = overrides?.mainModal?.component || ComposedModal;
  const MySearch = overrides?.search?.component || Search;
  const MyPublicCheckbox = overrides?.publicCheckbox?.component || Checkbox;
  const MyTableManageViewsList = overrides?.tableManageViewsList?.component || TableManageViewsList;
  const MyWarningModal = overrides?.warningModal?.component || Modal;

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [viewIdToDelete, setViewIdToDelete] = useState(null);

  const getDeleteWarningText = () => {
    const viewTitle = views.find((view) => view.id === viewIdToDelete).title;
    return deleteWarningTextTemplate(viewTitle);
  };

  const onShowWarning = (id) => {
    setViewIdToDelete(id);
    setShowDeleteWarning(true);
  };

  return (
    <>
      <MyMainModal
        className={`${iotPrefix}--manage-views-modal`}
        // TODO: remove deprecated 'testID' in v3.
        testID={testID || testId}
        error={error}
        header={{
          title: modalTitle,
        }}
        iconDescription={closeIconDescription}
        onClearError={onClearError}
        onClose={onClose}
        open={open}
        passiveModal
        selectorPrimaryFocus={`#${primaryInputId}`}
        {...overrides?.mainModal?.props}
      >
        <div className={`${iotPrefix}--manage-views-modal__filter-container`}>
          <MySearch
            className={`${iotPrefix}--manage-views-modal__search`}
            defaultValue={searchValueDefault}
            closeButtonLabelText={searchClearButtonLabelText}
            id={primaryInputId}
            name="searchValue"
            labelText={searchIconLabelText}
            onChange={(evt) => onSearchChange(evt?.target?.value)}
            placeholder={searchPlaceholderText}
            size="lg"
            type="text"
            {...overrides?.search?.props}
          />
          <MyPublicCheckbox
            name="isPublic"
            // TODO: remove deprecated 'testID' in v3.
            data-testid={`${testID || testId}-public-checkbox`}
            defaultChecked={displayPublicDefaultChecked}
            id="manage-views-modal-public-checkbox-label"
            labelText={publicCheckboxLabelText}
            wrapperClassName={`${iotPrefix}--manage-views-modal__public-checkbox`}
            onChange={(isPublic) => onDisplayPublicChange(isPublic)}
            {...overrides?.publicCheckbox?.props}
          />
        </div>
        <MyTableManageViewsList
          defaultViewId={defaultViewId}
          i18n={i18n}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onShowWarning}
          pagination={pagination}
          // TODO: remove deprecated 'testID' in v3.
          testID={`${testID || testId}-views-list`}
          views={views}
          {...overrides?.tableManageViewsList?.props}
        />
      </MyMainModal>
      {showDeleteWarning && (
        <MyWarningModal
          className={`${iotPrefix}--manage-views-modal-warning`}
          modalHeading={getDeleteWarningText(viewIdToDelete, views)}
          onRequestClose={() => {
            setShowDeleteWarning(false);
          }}
          onRequestSubmit={() => {
            onDelete(viewIdToDelete);
            setShowDeleteWarning(false);
          }}
          open={showDeleteWarning}
          primaryButtonText={deleteWarningConfirm}
          secondaryButtonText={deleteWarningCancel}
          size="sm"
          {...overrides?.warningModal?.props}
        />
      )}
    </>
  );
};

TableManageViewsModal.propTypes = propTypes;
TableManageViewsModal.defaultProps = defaultProps;
export default TableManageViewsModal;
