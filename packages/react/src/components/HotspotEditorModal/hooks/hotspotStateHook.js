import * as React from 'react';
import update from 'immutability-helper';
import { merge, isNil } from 'lodash-es';
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
  currentType: PropTypes.oneOf([hotspotTypes.FIXED, hotspotTypes.DYNAMIC, hotspotTypes.TEXT]),
  /** The currently selected hotspot */
  selectedHotspot: HotspotPropTypes,
  /** The data item containing the x source of the dynammic hotspot */
  dynamicHotspotSourceX: PropTypes.shape({ dataSourceId: PropTypes.string }),
  /** The data item containing the y source of the dynammic hotspot */
  dynamicHotspotSourceY: PropTypes.shape({ dataSourceId: PropTypes.string }),
  /** Loading flag for dynamic hotspots */
  dynamicHotspotsLoading: PropTypes.bool,
};

const hotspotActionTypes = {
  hotspotDataSourceChange: 'HOTSPOT_DATA_SOURCE_CHANGE',
  hotspotDataSourceSettingsChange: 'HOTSPOT_DATA_SOURCE_SETTINGS_CHANGE',
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
  state.hotspots.findIndex((hotspot) => isHotspotMatch(hotspot, state.selectedHotspot));

const getDynamicHotspotsUpdateFunction = (mergeSpec) => (arr) =>
  arr.map((hotspot) =>
    hotspot.type === hotspotTypes.DYNAMIC ? update(hotspot, mergeSpec) : hotspot
  );

/**
 * Returns an updated state for hotspot updates. It will update both the
 * selectedHotspot and the hotspots collection.
 */
const getHotspotUpdate = (state, mergeSpec) => {
  const isMultiHotspotUpdate = state.selectedHotspot.type === hotspotTypes.DYNAMIC;
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
      return getHotspotUpdate(state, {
        content: { attributes: { $set: payload.attributes } },
      });
    }
    // HOTSPOT DATA SOURCE SETTINGS CHANGE
    case hotspotActionTypes.hotspotDataSourceSettingsChange: {
      const attributeIndex =
        state.selectedHotspot.content?.attributes?.findIndex(
          (attr) => attr.dataSourceId === payload.dataSourceId
        ) ?? 0;
      const mergeSpec = {
        content: {
          attributes: {
            [attributeIndex]: {
              $merge: {
                dataItemId: payload.dataItemId,
                aggregationMethod: payload.aggregationMethod,
                label: payload.label,
                unit: payload.unit,
                dataFilter: payload.dataFilter,
                thresholds: payload.thresholds,
                precision: payload.precision,
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
      const defaultContent = state.currentType === hotspotTypes.TEXT ? { title: '' } : {};

      const createableType =
        state.currentType === hotspotTypes.DYNAMIC ? hotspotTypes.FIXED : state.currentType;

      const newHotspot = {
        ...payload.hotspotDefaults,
        ...payload.position,
        content: defaultContent,
        type: createableType,
      };

      return isPositionAvailable
        ? update(state, {
            selectedHotspot: { $set: newHotspot },
            hotspots: { $push: [newHotspot] },
          })
        : state;
    }
    // HOTSPOT SELECT
    case hotspotActionTypes.hotspotSelect: {
      const { x, y } = payload;
      const hotspotIndex = state.hotspots.findIndex((hotspot) => isHotspotMatch(hotspot, { x, y }));
      const hotspot = state.hotspots[hotspotIndex];
      const defaultTypeWhenMissing = hotspotTypes.FIXED;

      return update(state, {
        selectedHotspot: { $set: hotspot },
        currentType: { $set: hotspot.type ?? defaultTypeWhenMissing },
      });
    }
    // TEXT HOTSPOT STYLE CHANGE
    case hotspotActionTypes.textHotspotStyleChange: {
      const styleKey = Object.getOwnPropertyNames(payload)[0];
      const updateSpec = isNil(payload[styleKey])
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
        $unset: ['selectedHotspot'],
      });
    }
    // SELECTED HOTSPOT DELETE
    case hotspotActionTypes.selectedHotspotDelete: {
      return update(state, {
        hotspots: { $splice: [[getSelectedIndex(state), 1]] },
        $unset: ['selectedHotspot'],
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
        $unset: ['selectedHotspot'],
        dynamicHotspotSourceX: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOT SOURCE Y CHANGE
    case hotspotActionTypes.dynamicHotspotSourceYChange: {
      return update(state, {
        $unset: ['selectedHotspot'],
        dynamicHotspotSourceY: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOTS LOADING CHANGE
    case hotspotActionTypes.dynamicHotspotsLoadingChange: {
      return update(state, {
        dynamicHotspotsLoading: { $set: payload },
      });
    }

    // DYNAMIC HOTSPOTS SET, this clears the previous dynamic hotspots but leaves the static ones
    case hotspotActionTypes.dynamicHotspotsSet: {
      const stateWithoutDynamicHotspots = update(state, {
        hotspots: (arr) => arr.filter((hotspot) => hotspot.type !== hotspotTypes.DYNAMIC),
      });
      return update(stateWithoutDynamicHotspots, {
        hotspots: { $push: payload },
      });
    }

    // DYNAMIC HOTSPOT SOURCE CLEAR
    case hotspotActionTypes.dynamicHotspotSourceClear: {
      return update(state, {
        hotspots: (arr) => arr.filter((hotspot) => hotspot.type !== hotspotTypes.DYNAMIC),
        $unset: ['selectedHotspot', 'dynamicHotspotSourceX', 'dynamicHotspotSourceY'],
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
function useHotspotEditorState({ reducer = hotspotEditorReducer, initialState = {} } = {}) {
  const defaultState = {
    hotspots: [],
    currentType: hotspotTypes.FIXED,
    selectedHotspot: undefined,
    dynamicHotspotSourceX: undefined,
    dynamicHotspotSourceY: undefined,
    dynamicHotspotsLoading: false,
  };
  const mergedInitialState = merge({}, defaultState, initialState);

  const [
    {
      hotspots,
      selectedHotspot,
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

  /** update the hotspot data items for instance renaming or adding thresholds to a data item */
  const updateHotspotDataSource = (dataSourceChange) => {
    if (dataSourceChange.attributes) {
      dispatch({
        type: hotspotActionTypes.hotspotDataSourceChange,
        payload: dataSourceChange,
      });
    } else {
      dispatch({
        type: hotspotActionTypes.hotspotDataSourceSettingsChange,
        payload: dataSourceChange,
      });
    }
  };

  /**
   * Update the properties of the tooltip like 'title', 'description', 'icon', or 'color'
   * TODO: the title and description are under the content section so the `hotspotContent` argument needs to put those title and description updates
   * under a content key.  We should really just do that in the reducer ideally
   *
   */
  const updateHotspotTooltip = (hotspotContent) =>
    dispatch({
      type: hotspotActionTypes.hotspotTooltipChange,
      payload: hotspotContent,
    });

  /** Updates the properties of the text hotspot, passes a payload like {color: 'blue'} */
  const updateTextHotspotStyle = (textHotspotStyle) =>
    dispatch({
      type: hotspotActionTypes.textHotspotStyleChange,
      payload: textHotspotStyle,
    });

  /**
   * User clicks on the hotspot and this should change the selection
   * @param {*} hotspotPosition
   */
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

  /**
   *
   * @param {object} contentChange an example to update the title would be {title: 'my new title'}
   */
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

  /**
   * the assumption here is that demo hotspots are loaded to show in the image carrd
   * @param {*} dynamicHotspots
   */
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

export { hotspotActionTypes, hotspotTypes, hotspotEditorReducer, useHotspotEditorState };
