import createRouterProxy from 'react-cosmos-router-proxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';

// We ensure a specific proxy order
const proxies = [createRouterProxy(), createFetchProxy()];
export default proxies;
