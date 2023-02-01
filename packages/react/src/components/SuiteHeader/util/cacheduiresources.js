// eslint-disable-next-line import/extensions
import getUiResourcesData from './uiresources';

const getCachedUiResourcesData = async (options, cb) => {
  const cachedUIResourcesData = await getUiResourcesData({ ...options, useCache: true });
  cb(cachedUIResourcesData);
  const nonCachedUIResourcesData = await getUiResourcesData({ ...options });
  cb(nonCachedUIResourcesData);
};

export default getCachedUiResourcesData;
