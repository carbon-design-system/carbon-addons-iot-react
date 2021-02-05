import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Accordion, AccordionItem, Form, TextInput, Tab, Tabs } from 'carbon-components-react';

import { settings } from '../../constants/Settings';
import { ToolbarSVGWrapper } from '../Card/CardToolbar';
import Button from '../Button';

const { iotPrefix } = settings;

const propTypes = {
  className: PropTypes.string,
  /** Text for main tilte of page */
  defaultTitleText: PropTypes.string,
  /** Text for metadata for the filter */
  // metaText: PropTypes.string,
  /** Unique id for particular filter */
  // id: PropTypes.string,
  /**
   * Optional action buttons at top of page and callbacks to handle actions
   */
  actionBar: PropTypes.arrayOf(PropTypes.shape({
    actionId: PropTypes.string.isRequired,
    actionLabel: PropTypes.string.isRequired,
    actionIcon: PropTypes.elementType.isRequired,
    actionCallback: PropTypes.func.isRequired,
  })),
  saveLabel: PropTypes.string,
  handleOnSave: PropTypes.func.isRequired,
  cancelLabel: PropTypes.string,
  handleOnCancel: PropTypes.func.isRequired,
  /** filter object of the current selected filter */
  filter: PropTypes.shape({
    /** Unique id for particular filter */
    filterId: PropTypes.string,
    /** Text for main tilte of page */
    filterTitleText: PropTypes.string,
    /** Text for metadata for the filter */
    filterMetaText: PropTypes.string,
    /** tags associated with particular filter */
    filterTags: PropTypes.array,
    /** users that have access to particular filter */
    filterAccess: PropTypes.arrayOf(PropTypes.shape({
      userName: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      /** access types */
      access: PropTypes.oneOf(['edit', 'read']),
    })),
    /** All possible uers that can be granted access */
    filterUsers: PropTypes.arrayOf(PropTypes.shape({
      userName: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    })),

  }),
  /**
   * Optional footer buttons and callbacks to handle actions
   */
  footerButtons: PropTypes.arrayOf(PropTypes.shape({
    buttonId: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    buttonCallback: PropTypes.func.isRequired,
  })),
  filterTabText: PropTypes.string,
  sharingTabText: PropTypes.string,
  // onChange: PropTypes.func,
}

const defaultProps = {
  filter: null,
  className: null,
  defaultTitleText: 'Undefined',
  // metaText: null,
  // id: null,
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
  actionBar: null,
  footerButtons: null,
  filterTabText: 'Filter builder',
  sharingTabText: 'Sharing and preferences',
  // onChange: () => {},
};

const baseClass = `${iotPrefix}--rule-builder`;

const RuleBuilder = ({
  className,
  defaultTitleText,
  // metaText,
  // id,
  saveLabel,
  handleOnSave,
  cancelLabel,
  handleOnCancel,
  actionBar,
  footerButtons,
  filterTabText,
  sharingTabText,
  filter,
  // onChange,
  children,
}) => {
  const [currentFilter, setCurrentFilter] = React.useState(filter)
  const actions = useMemo(() => actionBar?.map((i)=> (
    <ToolbarSVGWrapper
      key={i.actionId}
      data-testid={i.actionId}
      title={i.actionLabel}
      onClick={i.actionCallback}
      iconDescription={i.actionLabel}
      renderIcon={i.actionIcon}
    />
  )), [actionBar])
  const footer = useMemo(() => footerButtons?.map((i) => (
    <Button data-testid={i.buttonId} key={i.buttonId} kind="secondary" className={`${baseClass}--footer-actions-preview`} onClick={i.buttonCallback} >{i.buttonLabel}</Button>
  )), [footerButtons]);

  const handleOnChange = (updatedFilter) => {
    setCurrentFilter(updatedFilter);
    onchange(updatedFilter);
  }

  return (
    <section className={classnames(baseClass, className)} id={currentFilter?.id} data-testid={currentFilter?.id || 'rule-builder'}>
      <header className={`${baseClass}--header`}>
        <div>
          <h1 className={`${baseClass}--header-title`}>{currentFilter?.titleText || defaultTitleText}</h1>
          {currentFilter?.metaText && (<p className={`${baseClass}--header-metatext`}>{currentFilter?.metaText}</p>)}
        </div>
        <div className={`${baseClass}--header-actions`}>
          {actions}
          <Button className={`${baseClass}--header-actions-save`} data-testid="rule-builder-save" onClick={handleOnSave} size="small">{saveLabel}</Button>
        </div>
      </header>
      <div className={`${baseClass}--body`}>
        <Tabs className={`${baseClass}--tabs`}>
          <Tab className={`${baseClass}--tab`} label={filterTabText}>
            {children}
          </Tab>
          <Tab className={`${baseClass}--tab`} label={sharingTabText}>
          <Accordion>
            <AccordionItem title="Section 1 title">
              <Form>
                <TextInput
                  type="text"

                />
              </Form>
            </AccordionItem>
            <AccordionItem title="Section 2 title">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </AccordionItem>
          </Accordion>
            <div>TODO: Build sharing and preferences</div>
          </Tab>
        </Tabs>
      </div>
      <footer className={`${baseClass}--footer`}>
        <Button kind="secondary" className={`${baseClass}--footer-actions-cancel`} data-testid="rule-builder-cancel" onClick={handleOnCancel} >{cancelLabel}</Button>
        {footer}
      </footer>
    </section>
  )
}

RuleBuilder.propTypes = propTypes;
RuleBuilder.defaultProps = defaultProps;

export default RuleBuilder;