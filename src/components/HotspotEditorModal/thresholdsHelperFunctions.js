import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import update from 'immutability-helper';

/**
 * Extracts an array with all the unque thresholds found
 * in the different hotspots.
 * @param {*} hotspots
 */
export const getUniqueThresholdsFromHotspots = (hotspots) => {
  const allThresholds = [];
  hotspots.forEach((hotspot) => {
    const attributes = hotspot.content?.attributes;
    if (attributes) {
      attributes.forEach((attr) => {
        const thresholdsWithIds = attr.thresholds?.length
          ? attr.thresholds.map((thresh) => ({
              ...thresh,
              dataSourceId: attr.dataSourceId,
            }))
          : [];
        allThresholds.push(...thresholdsWithIds);
      });
    }
  });
  return uniqWith(allThresholds, isEqual);
};

/**
 * Thresholds can be placed on the hotspot level or on the cardConfig level.
 * If there is a thresholds array prop on the cardConfig we copy the thresholds
 * to the matching hotspot. This is needed in order to display them in the
 * ImageHotspot component.
 * @param {*} cardConfig Config object for the card that might hold thresholds
 * @param {*} hotspot A hotspot that should be assign thresholds
 */
export const addThresholdsToHotspot = (cardConfig, hotspot) => {
  if (cardConfig.thresholds && hotspot.content?.attributes) {
    return update(hotspot, {
      content: {
        attributes: (arr) =>
          arr.map((attr) => {
            const thresholds = cardConfig.thresholds.filter(
              (thresh) => thresh.dataSourceId === attr.dataSourceId
            );
            return thresholds.length ? { ...attr, thresholds } : attr;
          }),
      },
    });
  }
  return hotspot;
};

/**
 * Removes all thresholds from the hotspots and adds the
 * non duplicates to the cardConfig.thresholds
 * @param {*} hotspots Hotspots that might contain thresholds
 * @param {*} cardConfig Will recieve the updated hotspots and thresholds prop
 */
export const moveThresholdsToCardconfigRoot = (hotspots, cardConfig) => {
  const uniqThresholds = getUniqueThresholdsFromHotspots(hotspots);

  const hotspotsWithoutThresholds = hotspots.map((hotspot) =>
    Array.isArray(hotspot.content.attributes)
      ? update(hotspot, {
          content: {
            attributes: (arr) =>
              arr.map(({ thresholds, ...restAttr }) => restAttr),
          },
        })
      : hotspot
  );

  return update(cardConfig, {
    values: {
      hotspots: {
        $set: hotspotsWithoutThresholds,
      },
    },
    thresholds: { $set: uniqThresholds },
  });
};
