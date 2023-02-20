import PropTypes from 'prop-types';

/** The prop types available for components using the overrides pattern.
 * A subcomponent can be overidden in two ways, by having its input (i.e. the props) overridden
 * or by having the component class or function itseld be overridden. The overrides pattern can be used with
 * nesting, i.e. to override the subcomponent or a subcomponent.
 */
export const OverridePropTypes = PropTypes.shape({
  /** props should be an object with properties (or a function returning an object) that is used to override the original props
   * received by the specified sub component. */
  props: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /** component should be a drop in replacement component for the subcomponent */
  component: PropTypes.elementType,
});

export const HotspotIconPropType = PropTypes.shape({
  id: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  text: PropTypes.string,
});

export const ColorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});

export const HotspotContentPropTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.string,
  values: PropTypes.objectOf(PropTypes.any),
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      dataSourceId: PropTypes.string,
      label: PropTypes.string,
      unit: PropTypes.string,
      precision: PropTypes.number,
      thresholds: PropTypes.arrayOf(
        PropTypes.shape({
          comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']),
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
          icon: PropTypes.string,
          color: PropTypes.string,
        })
      ),
    })
  ),
  /** overall threshold that launched the hotspot */
  hotspotThreshold: PropTypes.shape({
    dataSourceId: PropTypes.string,
    comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    icon: PropTypes.string,
    color: PropTypes.string,
  }),
  /** the locale to use for formatting numeric values */
  locale: PropTypes.string,

  /** ability to render icon by name */
  renderIconByName: PropTypes.func,
  /** when true the title can be edited by the user. */
  isTitleEditable: PropTypes.bool,
  /** the unique id of this component, used by input elements */
  id: PropTypes.string,
  /** For text hotspots, callback with current value for when the editable fields are blurred. */
  onChange: PropTypes.func,
  i18n: PropTypes.shape({
    /** The placeholder text for editable title */
    titlePlaceholderText: PropTypes.string,
    /** The html title attribute text for the title label when editable */
    titleEditableHintText: PropTypes.string,
  }),
};

export const HotspotPropTypes = {
  /** percentage from the left of the image to show this hotspot */
  x: PropTypes.number.isRequired,
  /** percentage from the top of the image to show this hotspot */
  y: PropTypes.number.isRequired,
  /** the content of the hotspot, either a react element or an object to use the default hotspot */
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.shape(HotspotContentPropTypes)])
    .isRequired,
  /** points to one of our enumerated icon names (ex. caretUp, edit, close)
   * TODO: add support for the carbon icon object (svgData, viewBox, width, height)
   */
  icon: PropTypes.string,
  iconDescription: PropTypes.string,
  /** color of the hotspot */
  color: PropTypes.string,
  /** width of the hotspot */
  width: PropTypes.number,
  /** height of the hotspot */
  height: PropTypes.number,
  /** optional function to provide icon based on name */
  renderIconByName: PropTypes.func,
  /**
   * onClick callback for when the hotspot is clicked. Returns the event and an
   * object width the x and y coordinates */
  onClick: PropTypes.func,
  /** shows a border with padding when set to true */
  isSelected: PropTypes.bool,
  /** determines the type of hotspot to render. Defaults to 'fixed'. */
  type: PropTypes.oneOf(['fixed', 'dynamic', 'text']),
  /** For text hotspots, true if title should be bold */
  bold: PropTypes.bool,
  /** For text hotspots, true if title should be italic */
  italic: PropTypes.bool,
  /** For text hotspots, true if title should be underline */
  underline: PropTypes.bool,
  /** For text hotspots, the hexdec color of the title font, e.g. #ff0000  */
  fontColor: PropTypes.string,
  /** For text hotspots, the size in px of the font, e.g. 12  */
  fontSize: PropTypes.number,
  /** For text hotspots, the hexdec color of the background, e.g. #ff0000  */
  backgroundColor: PropTypes.string,
  /** For text hotspots, the opactity of the background in percentage, e.g. 100 */
  backgroundOpacity: PropTypes.number,
  /** For text hotspots, the hexdec color of the border, e.g. #ff0000  */
  borderColor: PropTypes.string,
  /** For text hotspots, the border width in px, e.g. 12  */
  borderWidth: PropTypes.number,
};

export const SvgPropType = PropTypes.shape({
  type: PropTypes.oneOf(['svg']),
});

export const ButtonIconPropType = PropTypes.oneOfType([
  PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
    svgData: SvgPropType.isRequired,
  }),
  PropTypes.object, // Could be a react icon name
  PropTypes.element,
]);

export const CarbonIconPropType = PropTypes.oneOfType([PropTypes.func, PropTypes.object]);

export const HtmlElementRefProp = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.object]) }),
]);

export const WrapCellTextPropTypes = PropTypes.oneOf([
  'always',
  'never',
  'auto',
  'alwaysTruncate',
  'expand',
]);
