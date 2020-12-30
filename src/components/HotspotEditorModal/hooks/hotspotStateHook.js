import * as React from 'react';
import update from 'immutability-helper';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';

import { HotspotPropTypes } from '../../../constants/SharedPropTypes';

const hotspotTypes = {
  FIXED: 'fixed',
  DYNAMIC: 'dynamic',
  TEXT: 'text',
};

const hotspotStateProptypes = {
  /** The current thresholds from a card configuration object */
  thresholds: PropTypes.arrayOf(PropTypes.object),
  /** All the curren hotspots, including dynamic demo hotspots */
  hotspots: PropTypes.arrayOf(HotspotPropTypes),
  /** The type of hotspot that is currently being shown by the context switcher */
  currentType: PropTypes.oneOf([
    hotspotTypes.FIXED,
    hotspotTypes.DYNAMIC,
    hotspotTypes.TEXT,
  ]),
  /** The currently selected hotspot */
  selectedHotspot: HotspotPropTypes,
  /**  */
  selectedHotspotIndex: PropTypes.number,
  /** The data item containing the x source of the dynammic hotspot */
  dynamicHotspotSourceX: PropTypes.shape({ dataSourceId: PropTypes.string }),
  /** The data item containing the y source of the dynammic hotspot */
  dynamicHotspotSourceY: PropTypes.shape({ dataSourceId: PropTypes.string }),
  /** Loading flag for dynamic hotspots */
  dynamicHotspotsLoading: PropTypes.bool,
};

const hotspotActionTypes = {
  hotspotDataSourceChange: 'HOTSPOT_DATA_SOURCE_CHANGE',
  hotspotTooltipChange: 'HOTSPOT_TOOLTIP_CHANGE',
  hotspotSelect: 'HOTSPOT_SELECT',
  hotspotsAdd: 'HOTSPOTS_ADD',
  textHotspotStyleChange: 'TEXT_HOTSPOT_STYLE_CHANGE',
  textHotspotContentChange: 'TEXT_HOTSPOT_CONTENT_CHANGE',
  currentTypeSwitch: 'CURRENT_TYPE_SWITCH',
  selectedHotspotDelete: 'SELECTED_HOTSPOT_DELETE',
  dynamicHotspotSourceClear: 'DYNAMIC_HOTSPOT_SOURCE_CLEAR',
  dynamicHotspotSourceXChange: 'DYNAMIC_HOTSPOT_SOURCE_X_CHANGE',
  dynamicHotspotSourceYChange: 'DYNAMIC_HOTSPOT_SOURCE_Y_CHANGE',
  dynamicHotspotsLoadingChange: 'DYNAMIC_HOTSPOTS_LOADING_CHANGE',
  dynamicHotspotsSet: 'DYNAMIC_HOTSPOTS_SET',
};

const isHotspotMatch = (hotspot, position) => {
  return hotspot.x === position.x && hotspot.y === position.y;
};
const getSelectedIndex = (state) =>
  state.hotspots.findIndex((hotspot) =>
    isHotspotMatch(hotspot, state.selectedHotspot)
  );

const getDynamicHotspotsUpdateFunction = (mergeSpec) => (arr) =>
  arr.map((hotspot) =>
    hotspot.type === hotspotTypes.DYNAMIC ? update(hotspot, mergeSpec) : hotspot
  );

/**
 * Returns an updated state for hotspot updates. It will update both the
 * selectedHotspot and the hotspots collection.
 */
const getHotspotUpdate = (state, mergeSpec) => {
  const isMultiHotspotUpdate =
    state.selectedHotspot.type === hotspotTypes.DYNAMIC;
  const modifiedHotspot = update(state.selectedHotspot, mergeSpec);

  const collectionUpdateSpec = isMultiHotspotUpdate
    ? getDynamicHotspotsUpdateFunction(mergeSpec)
    : { [getSelectedIndex(state)]: { $set: modifiedHotspot } };

  return update(state, {
    hotspots: collectionUpdateSpec,
    selectedHotspot: { $set: modifiedHotspot },
  });
};

/**
 * hotspotEditorReducer
 * @param {hotspotStateProptypes} state
 * @param {*} action
 */
function hotspotEditorReducer(state, { type, payload }) {
  switch (type) {
    // HOTSPOT DATA SOURCE CHANGE
    case hotspotActionTypes.hotspotDataSourceChange: {
      const attributeIndex =
        state.selectedHotspot.content?.attributes?.findIndex(
          (attr) => attr.dataSourceId === payload.dataSourceId
        ) ?? 0;
      const mergeSpec = payload.attributes
        ? { content: { attributes: { $set: payload.attributes } } }
        : {
            content: {
              attributes: {
                [attributeIndex]: {
                  $merge: {
                    label: payload.label,
                    unit: payload.unit,
                    dataFilter: payload.dataFilter,
                  },
                },
              },
            },
          };
      return getHotspotUpdate(state, mergeSpec);
    }
    // HOTSPOT TOOLTIP CHANGE
    case hotspotActionTypes.hotspotTooltipChange: {
      const mergeSpec = payload.content
        ? { content: { $merge: payload.content } }
        : { $merge: payload };
      return getHotspotUpdate(state, mergeSpec);
    }
    // HOTSPOTS ADD
    case hotspotActionTypes.hotspotsAdd: {
      const isPositionAvailable = !state.hotspots.find((hotspot) =>
        isHotspotMatch(hotspot, payload.position)
      );
      const defaultContent =
        state.currentType === hotspotTypes.TEXT ? { title: '' } : {};

      const createableType =
        state.currentType === hotspotTypes.DYNAMIC
          ? hotspotTypes.FIXED
          : state.currentType;

      const newHotspot = {
        ...payload.hotspotDefaults,
        ...payload.position,
        content: defaultContent,
        type: createableType,
      };

      return isPositionAvailable
        ? update(state, {
            selectedHotspotIndex: { $set: state.hotspots.lenght },
            selectedHotspot: { $set: newHotspot },
            hotspots: { $push: [newHotspot] },
          })
        : state;
    }
    // HOTSPOT SELECT
    case hotspotActionTypes.hotspotSelect: {
      const { x, y } = payload;
      const hotspotIndex = state.hotspots.findIndex((hotspot) =>
        isHotspotMatch(hotspot, { x, y })
      );
      const hotspot = state.hotspots[hotspotIndex];
      const defaultTypeWhenMissing = hotspotTypes.FIXED;

      return update(state, {
        selectedHotspotIndex: { $set: hotspotIndex },
        selectedHotspot: { $set: hotspot },
        currentType: { $set: hotspot.type ?? defaultTypeWhenMissing },
      });
    }
    // TEXT HOTSPOT STYLE CHANGE
    case hotspotActionTypes.textHotspotStyleChange: {
      const styleKey = Object.getOwnPropertyNames(payload)[0];
      const updateSpec =
        payload[styleKey] === undefined
          ? {
              $unset: [styleKey],
            }
          : {
              $merge: payload,
            };

      const modifiedHotspot = update(state.selectedHotspot, updateSpec);

      return update(state, {
        selectedHotspot: { $set: modifiedHotspot },
        hotspots: { [getSelectedIndex(state)]: { $set: modifiedHotspot } },
      });
    }
    // CURRENT TYPE SWITCH
    case hotspotActionTypes.currentTypeSwitch: {
      return update(state, {
        currentType: { $set: payload },
        $unset: ['selectedHotspot', 'selectedHotspotIndex'],
      });
    }
    // SELECTED HOTSPOT DELETE
    case hotspotActionTypes.selectedHotspotDelete: {
      return update(state, {
        hotspots: { $splice: [[getSelectedIndex(state), 1]] },
        $unset: ['selectedHotspot', 'selectedHotspotIndex'],
      });
    }
    // TEXT HOTSPOT CONTENT CHANGE
    case hotspotActionTypes.textHotspotContentChange: {
      const modifiedHotspot = update(state.selectedHotspot, {
        content: { $merge: payload },
      });

      return update(state, {
        selectedHotspot: { $set: modifiedHotspot },
        hotspots: { [getSelectedIndex(state)]: { $set: modifiedHotspot } },
      });
    }

    // DYNAMIC HOTSPOT SOURCE X CHANGE
    case hotspotActionTypes.dynamicHotspotSourceXChange: {
      return update(state, {
        $unset: ['selectedHotspot', 'selectedHotspotIndex'],
        dynamicHotspotSourceX: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOT SOURCE Y CHANGE
    case hotspotActionTypes.dynamicHotspotSourceYChange: {
      return update(state, {
        $unset: ['selectedHotspot', 'selectedHotspotIndex'],
        dynamicHotspotSourceY: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOTS LOADING CHANGE
    case hotspotActionTypes.dynamicHotspotsLoadingChange: {
      return update(state, {
        dynamicHotspotsLoading: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOTS SET
    case hotspotActionTypes.dynamicHotspotsSet: {
      const stateWithoutDynamicHotspots = update(state, {
        hotspots: (arr) =>
          arr.filter((hotspot) => hotspot.type !== hotspotTypes.DYNAMIC),
      });
      return update(stateWithoutDynamicHotspots, {
        hotspots: { $push: payload },
      });
    }

    // DYNAMIC HOTSPOT SOURCE CLEAR
    case hotspotActionTypes.dynamicHotspotSourceClear: {
      return update(state, {
        hotspots: (arr) =>
          arr.filter((hotspot) => hotspot.type !== hotspotTypes.DYNAMIC),
        $unset: [
          'selectedHotspot',
          'selectedHotspotIndex',
          'dynamicHotspotSourceX',
          'dynamicHotspotSourceY',
        ],
      });
    }

    default: {
      throw new Error(`Unhandled type: ${type}`);
    }
  }
}

/**
 * The HotspotEditorModal's custom state manager hook that allows for inversion of control
 * by accepting a custom the reducer, which can be based on the exported default hotspotEditorReducer.
 * @param {Object} Configuration with 'reducer' and 'initialState'
 */
function useHotspotEditorState({
  reducer = hotspotEditorReducer,
  initialState = {},
} = {}) {
  const defaultState = {
    thresholds: [],
    hotspots: [],
    currentType: hotspotTypes.FIXED,
    selectedHotspot: undefined,
    // TODO: Would be nice if we could skip dealing with this index used by the HotspotEditorDataSourceTab
    // https://github.com/carbon-design-system/carbon-addons-iot-react/issues/1769
    selectedHotspotIndex: undefined,
    dynamicHotspotSourceX: undefined,
    dynamicHotspotSourceY: undefined,
    dynamicHotspotsLoading: false,
  };
  const mergedInitialState = merge({}, defaultState, initialState);

  const [
    {
      hotspots,
      selectedHotspot,
      selectedHotspotIndex,
      currentType,
      thresholds,
      dynamicHotspotsLoading,
      dynamicHotspotSourceX,
      dynamicHotspotSourceY,
    },
    dispatch,
  ] = React.useReducer(reducer, mergedInitialState);

  const addHotspot = (hotspotCoordinates) =>
    dispatch({
      type: hotspotActionTypes.hotspotsAdd,
      payload: hotspotCoordinates,
    });

  const deleteSelectedHotspot = () => {
    dispatch({
      type: hotspotActionTypes.selectedHotspotDelete,
    });
  };

  const updateHotspotDataSource = (hotspotContent) =>
    dispatch({
      type: hotspotActionTypes.hotspotDataSourceChange,
      payload: hotspotContent,
    });

  const updateHotspotTooltip = (hotspotContent) =>
    dispatch({
      type: hotspotActionTypes.hotspotTooltipChange,
      payload: hotspotContent,
    });

  const updateTextHotspotStyle = (textHotspotStyle) =>
    dispatch({
      type: hotspotActionTypes.textHotspotStyleChange,
      payload: textHotspotStyle,
    });

  const setSelectedHotspot = (hotspotPosition) =>
    dispatch({
      type: hotspotActionTypes.hotspotSelect,
      payload: hotspotPosition,
    });

  const switchCurrentType = (contentName) =>
    dispatch({
      type: hotspotActionTypes.currentTypeSwitch,
      payload: contentName,
    });

  const updateTextHotspotContent = (contentChange) =>
    dispatch({
      type: hotspotActionTypes.textHotspotContentChange,
      payload: contentChange,
    });

  const updateDynamicHotspotSourceX = (sourceId) =>
    dispatch({
      type: hotspotActionTypes.dynamicHotspotSourceXChange,
      payload: sourceId,
    });

  const updateDynamicHotspotSourceY = (sourceId) =>
    dispatch({
      type: hotspotActionTypes.dynamicHotspotSourceYChange,
      payload: sourceId,
    });

  const setLoadingDynamicHotspots = (isLoading) =>
    dispatch({
      type: hotspotActionTypes.dynamicHotspotsLoadingChange,
      payload: isLoading,
    });

  const setDynamicHotspots = (dynamicHotspots) =>
    dispatch({
      type: hotspotActionTypes.dynamicHotspotsSet,
      payload: dynamicHotspots,
    });

  const clearDynamicHotspotsSource = () =>
    dispatch({
      type: hotspotActionTypes.dynamicHotspotSourceClear,
    });

  return {
    currentType,
    hotspots,
    selectedHotspot,
    selectedHotspotIndex,
    thresholds,
    dynamicHotspotsLoading,
    dynamicHotspotSourceX,
    dynamicHotspotSourceY,
    addHotspot,
    deleteSelectedHotspot,
    clearDynamicHotspotsSource,
    setSelectedHotspot,
    setLoadingDynamicHotspots,
    setDynamicHotspots,
    switchCurrentType,
    updateHotspotDataSource,
    updateHotspotTooltip,
    updateTextHotspotStyle,
    updateTextHotspotContent,
    updateDynamicHotspotSourceX,
    updateDynamicHotspotSourceY,
  };
}
useHotspotEditorState.prototypes = {
  configuration: PropTypes.shape({
    reducer: PropTypes.func,
    initialState: hotspotStateProptypes,
  }),
};

export {
  hotspotActionTypes,
  hotspotTypes,
  hotspotEditorReducer,
  useHotspotEditorState,
};
