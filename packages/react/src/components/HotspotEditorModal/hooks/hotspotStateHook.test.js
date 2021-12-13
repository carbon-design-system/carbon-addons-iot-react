import { omit } from 'lodash-es';

import { hotspotEditorReducer, hotspotActionTypes, hotspotTypes } from './hotspotStateHook';

describe('hotspotStateHook tests', () => {
  const mockDataItem = {
    dataSourceId: 'temperature',
    label: 'Temperature',
    unit: 'degrees',
  };
  const staticHotspot = {
    x: 5,
    y: 5,
    content: {
      attributes: [mockDataItem],
    },
    type: hotspotTypes.STATIC,
  };
  const mockHotspotState = {
    hotspots: [staticHotspot],
    selectedHotspot: staticHotspot,
    currentType: hotspotTypes.FIXED,
  };

  it('hotspotEditorReducer datasourceChange with new attribute added', () => {
    const mockPayload = { attributes: [{ id: 'newAttribute' }] };
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotDataSourceChange,
        payload: mockPayload,
      })
    ).toEqual({
      hotspots: [{ ...staticHotspot, content: mockPayload }],
      selectedHotspot: { ...staticHotspot, content: mockPayload },
      currentType: hotspotTypes.FIXED,
    });
  });
  it('hotspotEditorReducer datasourceSettingsChange with new thresholds added', () => {
    // This is the actual updates the user has made in the form to add a threshold
    const updatedDataItemWithThresholds = {
      ...mockDataItem,
      thresholds: {
        // Add a new threshold to the card inside the data item
        dataSourceId: 'temperature',
        label: 'Temperature',
        unit: 'degrees',
      },
    };
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotDataSourceSettingsChange,
        payload: updatedDataItemWithThresholds,
      })
    ).toEqual({
      hotspots: [
        {
          ...staticHotspot,
          content: {
            attributes: [updatedDataItemWithThresholds],
          },
        },
      ],
      selectedHotspot: {
        ...staticHotspot,
        content: {
          attributes: [updatedDataItemWithThresholds],
        },
      },
      currentType: hotspotTypes.FIXED,
    });
  });
  it('hotspotTooltipChange updates to title and icon', () => {
    const mockPayloadInContent = { content: { title: 'title' } };

    // update something in the content section
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotTooltipChange,
        payload: mockPayloadInContent,
      })
    ).toEqual({
      hotspots: [
        {
          ...staticHotspot,
          content: { ...staticHotspot.content, title: 'title' },
        },
      ],
      selectedHotspot: {
        ...staticHotspot,
        content: { ...staticHotspot.content, title: 'title' },
      },
      currentType: hotspotTypes.FIXED,
    });

    // now update icon for the hotspot
    const mockPayload = { icon: 'myIcon' };
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotTooltipChange,
        payload: mockPayload,
      })
    ).toEqual({
      hotspots: [
        {
          ...staticHotspot,
          icon: 'myIcon',
        },
      ],
      selectedHotspot: { ...staticHotspot, icon: 'myIcon' },
      currentType: hotspotTypes.FIXED,
    });
  });
  it('hotspotEditorReducer hotspotsAdd usecases', () => {
    // First try and add a hotspot that already exists, shouldn't change the state
    const duplicateHotspotPayload = {
      hotspotDefaults: 'hotspotDefaults',
      position: { x: 5, y: 5 },
    };
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotsAdd,
        payload: duplicateHotspotPayload,
      })
    ).toEqual(mockHotspotState);

    // Now try to add a fixed hotspot that doesn't exist
    const newHotspotPayload = {
      position: { x: 6, y: 6 },
    };
    expect(
      hotspotEditorReducer(mockHotspotState, {
        type: hotspotActionTypes.hotspotsAdd,
        payload: newHotspotPayload,
      })
    ).toEqual({
      hotspots: mockHotspotState.hotspots.concat([
        {
          ...newHotspotPayload.position,
          content: {},
          type: hotspotTypes.FIXED,
        },
      ]),
      selectedHotspot: {
        ...newHotspotPayload.position,
        content: {},
        type: hotspotTypes.FIXED,
      },
      currentType: hotspotTypes.FIXED,
    });

    // Now try to add a text hotspot that doesn't exist, should set default title
    const newTextHotspotPayload = {
      position: { x: 6, y: 6 },
    };
    expect(
      hotspotEditorReducer(
        { ...mockHotspotState, currentType: hotspotTypes.TEXT },
        {
          type: hotspotActionTypes.hotspotsAdd,
          payload: newTextHotspotPayload,
        }
      )
    ).toEqual({
      hotspots: mockHotspotState.hotspots.concat([
        {
          ...newTextHotspotPayload.position,
          content: { title: '' },
          type: hotspotTypes.TEXT,
        },
      ]),
      selectedHotspot: {
        ...newTextHotspotPayload.position,
        content: { title: '' },
        type: hotspotTypes.TEXT,
      },
      currentType: hotspotTypes.TEXT,
    });
  });
  it('hotspotSelect', () => {
    const staticHotspot2 = {
      x: 6,
      y: 6,
      content: {
        attributes: [mockDataItem],
      },
      type: hotspotTypes.DYNAMIC,
    };
    const multipleHotspotState = {
      hotspots: [staticHotspot, staticHotspot2],
      selectedHotspot: staticHotspot,
      currentType: hotspotTypes.FIXED,
    };
    expect(
      hotspotEditorReducer(multipleHotspotState, {
        type: hotspotActionTypes.hotspotSelect,
        payload: { x: 6, y: 6 },
      })
    ).toEqual({
      hotspots: [staticHotspot, staticHotspot2],
      selectedHotspot: staticHotspot2,
      currentType: hotspotTypes.DYNAMIC,
    });
  });
  it('textHotspotStyleChange', () => {
    const textHotspot = {
      x: 6,
      y: 6,
      type: hotspotTypes.TEXT,
    };
    const textHotspotState = {
      hotspots: [textHotspot],
      selectedHotspot: textHotspot,
      currentType: hotspotTypes.TEXT,
    };
    const stateWithColorBlue = {
      hotspots: [{ ...textHotspot, color: 'blue' }],
      selectedHotspot: { ...textHotspot, color: 'blue' },
      currentType: hotspotTypes.TEXT,
    };

    // set a color value
    expect(
      hotspotEditorReducer(textHotspotState, {
        type: hotspotActionTypes.textHotspotStyleChange,
        payload: { color: 'blue' },
      })
    ).toEqual(stateWithColorBlue);

    // clear a color value
    expect(
      hotspotEditorReducer(stateWithColorBlue, {
        type: hotspotActionTypes.textHotspotStyleChange,
        payload: { color: null },
      })
    ).toEqual({
      hotspots: [textHotspot],
      selectedHotspot: textHotspot,
      currentType: hotspotTypes.TEXT,
    });
    // clear a color value
    expect(
      hotspotEditorReducer(stateWithColorBlue, {
        type: hotspotActionTypes.textHotspotStyleChange,
        payload: { color: undefined },
      })
    ).toEqual({
      hotspots: [textHotspot],
      selectedHotspot: textHotspot,
      currentType: hotspotTypes.TEXT,
    });
  });
  it('textHotspotContentChange', () => {
    const textHotspot = {
      x: 6,
      y: 6,
      content: { title: 'my title is bad', description: 'description' },
      type: hotspotTypes.TEXT,
    };
    const textHotspotState = {
      hotspots: [textHotspot],
      selectedHotspot: textHotspot,
      currentType: hotspotTypes.TEXT,
    };
    const stateWithUpdatedTitle = {
      hotspots: [
        {
          ...textHotspot,
          content: { title: 'updated', description: 'description' },
        },
      ],
      selectedHotspot: {
        ...textHotspot,
        content: { title: 'updated', description: 'description' },
      },
      currentType: hotspotTypes.TEXT,
    };

    // set a color value
    expect(
      hotspotEditorReducer(textHotspotState, {
        type: hotspotActionTypes.textHotspotContentChange,
        payload: { title: 'updated' },
      })
    ).toEqual(stateWithUpdatedTitle);
  });
  it('actionTypes currentTypeSwitch', () => {
    const staticHotspot2 = {
      x: 6,
      y: 6,
      content: {
        attributes: [mockDataItem],
      },
      type: hotspotTypes.DYNAMIC,
    };
    const multipleHotspotState = {
      hotspots: [staticHotspot, staticHotspot2],
      selectedHotspot: staticHotspot,
      currentType: hotspotTypes.FIXED,
    };

    // switch the currentType from FIXED to DYNAMIC
    expect(
      hotspotEditorReducer(multipleHotspotState, {
        type: hotspotActionTypes.currentTypeSwitch,
        payload: hotspotTypes.DYNAMIC,
      })
    ).toEqual({
      hotspots: [staticHotspot, staticHotspot2],
      currentType: hotspotTypes.DYNAMIC,
    });
  });
  it('actionTypes selectedHotspotDelete', () => {
    const staticHotspot2 = {
      x: 6,
      y: 6,
      content: {
        attributes: [mockDataItem],
      },
      type: hotspotTypes.DYNAMIC,
    };
    const multipleHotspotState = {
      hotspots: [staticHotspot, staticHotspot2],
      selectedHotspot: staticHotspot,
      currentType: hotspotTypes.FIXED,
    };

    // switch the currentType from FIXED to DYNAMIC
    expect(
      hotspotEditorReducer(multipleHotspotState, {
        type: hotspotActionTypes.selectedHotspotDelete,
      })
    ).toEqual({
      hotspots: [staticHotspot2],
      currentType: hotspotTypes.FIXED,
    });
  });
  // Dynamic hotspot actions
  it('actionTypes dynamicHotspotSourceXChange', () => {
    const dynamicHotspotState = {
      hotspots: [staticHotspot],
      selectedHotspot: staticHotspot,
      dynamicHotspotSourceX: 'myDataItem',
      currentType: hotspotTypes.FIXED,
    };

    // update the dynamic hotspot source x
    expect(
      hotspotEditorReducer(dynamicHotspotState, {
        type: hotspotActionTypes.dynamicHotspotSourceXChange,
        payload: 'myDataItem2',
      })
    ).toEqual({
      ...omit(dynamicHotspotState, 'selectedHotspot'),
      dynamicHotspotSourceX: 'myDataItem2',
    });
  });
  it('actionTypes dynamicHotspotSourceYChange', () => {
    const dynamicHotspotState = {
      hotspots: [staticHotspot],
      selectedHotspot: staticHotspot,
      dynamicHotspotSourceY: 'myDataItem',
      currentType: hotspotTypes.FIXED,
    };

    // update the dynamic hotspot source x
    expect(
      hotspotEditorReducer(dynamicHotspotState, {
        type: hotspotActionTypes.dynamicHotspotSourceYChange,
        payload: 'myDataItem2',
      })
    ).toEqual({
      ...omit(dynamicHotspotState, 'selectedHotspot'),
      dynamicHotspotSourceY: 'myDataItem2',
    });
  });
  it('actionTypes dynamicHotspotsLoadingChange', () => {
    const dynamicHotspotState = {
      hotspots: [staticHotspot],
      selectedHotspot: staticHotspot,
      dynamicHotspotsLoading: false,
      currentType: hotspotTypes.FIXED,
    };

    // update the dynamic hotspot loading
    expect(
      hotspotEditorReducer(dynamicHotspotState, {
        type: hotspotActionTypes.dynamicHotspotsLoadingChange,
        payload: true,
      })
    ).toEqual({
      ...dynamicHotspotState,
      dynamicHotspotsLoading: true,
    });
  });
  it('actionTypes dynamicHotspotsSet', () => {
    const dynamicHotspot = {
      x: 6,
      y: 6,
      content: {
        attributes: [mockDataItem],
      },
      type: hotspotTypes.DYNAMIC,
    };
    const dynamicHotspotState = {
      hotspots: [staticHotspot, dynamicHotspot],
      selectedHotspot: staticHotspot,
      currentType: hotspotTypes.DYNAMIC,
    };

    // update the dynamic hotspot loading
    expect(
      hotspotEditorReducer(dynamicHotspotState, {
        type: hotspotActionTypes.dynamicHotspotsSet,
        payload: [],
      })
    ).toEqual({
      ...dynamicHotspotState,
      hotspots: [staticHotspot],
    });
  });
  it('actionTypes dynamicHotspotSourceClearr', () => {
    const dynamicHotspot = {
      x: 6,
      y: 6,
      content: {
        attributes: [mockDataItem],
      },

      type: hotspotTypes.DYNAMIC,
    };
    const dynamicHotspotState = {
      hotspots: [staticHotspot, dynamicHotspot],
      selectedHotspot: staticHotspot,
      dynamicHotspotSourceX: 'dataItem1',
      dynamicHotspotSourceY: 'dataItem1',
      currentType: hotspotTypes.DYNAMIC,
    };

    // Clear the dynamic hotspot source
    expect(
      hotspotEditorReducer(dynamicHotspotState, {
        type: hotspotActionTypes.dynamicHotspotSourceClear,
      })
    ).toEqual({
      ...omit(
        dynamicHotspotState,
        'selectedHotspot',
        'dynamicHotspotSourceX',
        'dynamicHotspotSourceY'
      ),
      hotspots: [staticHotspot],
    });
  });
  it('hotspot action types invalid type', () => {
    expect(() => hotspotEditorReducer(mockHotspotState, { type: 'bogus' })).toThrow();
  });
});
