import { ChevronDown32 } from '@carbon/icons-react';
import { settings } from 'carbon-components';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { HeaderMenuItem } from 'carbon-components-react/es/components/UIShell';

import { ChildContentPropTypes } from '../HeaderPropTypes';
import { handleSpecificKeyDown } from '../../../utils/componentUtilityFunctions';

const { prefix } = settings;

// eslint-disable-next-line react/prop-types
const defaultRenderMenuContent = ({ ariaLabel }) => (
  <>
    {ariaLabel}
    <ChevronDown32 className={`${prefix}--header__menu-arrow`} />
  </>
);

/**
 * `HeaderActionMenu` is used to render submenu's in the `Header`. Most often children
 * will be a `HeaderActionMenuItem`. It handles certain keyboard events to help
 * with managing focus. It also passes along refs to each child so that it can
 * help manage focus state of its children.
 */
class HeaderActionMenu extends React.Component {
  static propTypes = {
    /** Ref object to be attached to the parent that should receive focus when a menu is closed */
    focusRef: PropTypes.oneOfType([
      // Either a function
      PropTypes.func,
      // Or the instance of a DOM native element (see the note about SSR)
      PropTypes.shape({
        current: typeof Element === 'undefined' ? PropTypes.any : PropTypes.instanceOf(Element),
      }),
    ]).isRequired,
    /** Optionally provide a tabIndex for the underlying menu button */
    tabIndex: PropTypes.number,
    /** Optional component to render instead of string */
    renderMenuContent: PropTypes.func,
    /** Determines if the header panel should be rendered which is decided by Header */
    isExpanded: PropTypes.bool,
    /** Hides/unhides the header panel logic */
    onToggleExpansion: PropTypes.func.isRequired,
    /** Unique name used by handleExpandedState */
    label: PropTypes.string.isRequired,
    /** MenuItem's to be rendered as children */
    childContent: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)).isRequired,
  };

  static defaultProps = {
    renderMenuContent: defaultRenderMenuContent,
    isExpanded: false,
    tabIndex: null,
  };

  state = {
    isOverflowing: [],
  };

  constructor(props) {
    super(props);
    this.menuItemRefs = props.childContent.map(() => React.createRef(null));
  }

  componentDidMount() {
    const { isExpanded } = this.props;
    if (isExpanded) {
      this.checkForOverflows();
    }
  }

  componentDidUpdate(prevProps) {
    const { isExpanded } = this.props;
    if (isExpanded && !prevProps.isExpanded) {
      this.checkForOverflows();
    }
  }

  checkForOverflows() {
    this.setState({
      isOverflowing: this.menuItemRefs.map((ref) => {
        const element = ref.current.firstChild;
        return (
          element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth
        );
      }),
    });
  }

  render() {
    const {
      // eslint-disable-next-line react/prop-types
      'aria-label': ariaLabel,
      // eslint-disable-next-line react/prop-types
      'aria-labelledby': ariaLabelledBy,
      className: customClassName,
      renderMenuContent: MenuContent,
      childContent,
      onToggleExpansion,
      label,
      focusRef,
      isExpanded,
    } = this.props;

    const accessibilityLabel = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    };

    const className = classnames(`${prefix}--header__submenu`, customClassName);

    // Prevents the a element from navigating to it's href target
    const handleDefaultClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      onToggleExpansion();
    };

    // Notes on eslint comments and based on the examples in:
    // https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html#
    // - The focus is handled by the <a> menuitem, onMouseOver is for mouse
    // users
    // - aria-haspopup can definitely have the value "menu"
    // - aria-expanded is on their example node with role="menuitem"
    // - href can be set to javascript:void(0), ideally this will be a button

    return (
      // TODO: CAN WE REMOVE THIS DIV WRAPPER AND ATTACH THE CLASS DIRECTLY
      <div className={className}>
        <a // eslint-disable-line jsx-a11y/role-supports-aria-props,jsx-a11y/anchor-is-valid
          aria-haspopup="menu" // eslint-disable-line jsx-a11y/aria-proptypes
          aria-expanded={isExpanded}
          className={classnames(`${prefix}--header__menu-item`, `${prefix}--header__menu-title`)}
          href="#"
          onKeyDown={handleSpecificKeyDown(['Enter', 'Space', 'Escape'], handleDefaultClick)}
          onClick={handleDefaultClick}
          ref={focusRef}
          data-testid="menuitem"
          tabIndex={0}
          aria-label={ariaLabel}
          role="menuitem"
        >
          <MenuContent ariaLabel={ariaLabel} />
        </a>
        <ul {...accessibilityLabel} className={`${prefix}--header__menu`} role="menu">
          {childContent.map((childItem, index) => {
            const { isOverflowing } = this.state;
            const childIsOverflowing = isOverflowing[index];
            const fallbackTitle = this.menuItemRefs?.[index]?.current?.textContent ?? '';
            const title =
              childItem.metaData?.title ?? (childIsOverflowing ? fallbackTitle : undefined);
            const onKeyDownClick = (e) => e.target.click();

            // if the item is an A and doesn't have an onClick event
            // do nothing. An A tag doesn't need an onClick handler.
            const onClick =
              childItem.metaData?.element === 'a' && !childItem.metaData?.onClick
                ? undefined
                : // otherwise, if an onClick exists use that, or fallback to a noop.
                  childItem.metaData?.onClick || (() => {});

            // if item has onKeyDown use that otherwise, fallback to onClick if it exists
            // or create a custom handler to trigger the click
            const onKeyDown = childItem?.metaData?.onKeyDown
              ? childItem.metaData.onKeyDown
              : onClick || onKeyDownClick;

            return (
              <HeaderMenuItem
                ref={this.menuItemRefs[index]}
                key={`menu-item-${label + index}-child`}
                {...childItem.metaData}
                title={title}
                onClick={onClick}
                onKeyDown={handleSpecificKeyDown(['Enter', ' '], onKeyDown)}
              >
                {childItem.content}
              </HeaderMenuItem>
            );
          })}
        </ul>
      </div>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default React.forwardRef((props, ref) => {
  return <HeaderActionMenu {...props} focusRef={ref} />;
});
