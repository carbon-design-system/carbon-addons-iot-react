// eslint-disable-next-line import/extensions
import getUiResourcesData from './uiresources';

const getCachedUiResourcesData = async (options, cb, errCb) => {
  try {
    const cachedUIResourcesData = await getUiResourcesData({ ...options, useCache: true });
    cb(cachedUIResourcesData);
    const nonCachedUIResourcesData = await getUiResourcesData({ ...options });
    cb(nonCachedUIResourcesData);
  } catch (err) {
    // istanbul ignore next
    errCb(err);
  }
};

export default getCachedUiResourcesData;
