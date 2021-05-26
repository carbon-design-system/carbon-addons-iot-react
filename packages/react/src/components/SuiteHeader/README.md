# `SuiteHeader` component

## Examples of usage

### Using native `fetch` to retrieve data

```
import { SuiteHeader } from 'carbon-addons-iot-react';

const SuiteHeaderWithDataFetchingExample = () => {
  const [data, setData] = useState({
    username: null,
    userDisplayName: null,
    routes: null,
    applications: null,
    i18n: null,
    surveyData: null,
  });
  useEffect(() => {
    fetch('http://localhost:3001/internal/uiresources?id=masthead&lang=en&surveyId=test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.error || resJson.exception) {
          return null;
        }
        return setData(resJson);
      });
  }, []);

  return (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName={data.userDisplayName}
      username={data.username}
      routes={data.routes}
      applications={data.applications}
      i18n={data.i18n}
      surveyData={data.surveyData}
    />
  );
};
```

### Using provided data fetching util

```
import { SuiteHeader, uiresources } from 'carbon-addons-iot-react';

const SuiteHeaderWithDataFetchingUtilExample = () => {
  const [data, setData] = useState({
    username: null,
    userDisplayName: null,
    routes: null,
    applications: null,
    i18n: null,
    surveyData: null,
  });
  useEffect(() => {
    uiresources({
      baseApiUrl: 'http://localhost:3001/internal',
      lang: 'en',
      surveyId: 'test',
    }).then(setData);
  }, []);

  return (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName={data.userDisplayName}
      username={data.username}
      routes={data.routes}
      applications={data.applications}
      i18n={data.i18n}
      surveyData={data.surveyData}
    />
  );
};
```

### Using provided data fetching hook (recommended)

```
import { SuiteHeader, useUiResources } from 'carbon-addons-iot-react';

const SuiteHeaderWithDataFetchingHookExample = () => {
  const [data] = useUiResources({
    baseApiUrl: 'http://localhost:3001/internal',
    lang: 'en',
    surveyId: 'test',
  });

  return (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName={data.userDisplayName}
      username={data.username}
      routes={data.routes}
      applications={data.applications}
      i18n={data.i18n}
      surveyData={data.surveyData}
    />
  );
};
```
