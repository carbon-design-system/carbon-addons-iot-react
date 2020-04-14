import React from 'react';
import { render } from 'react-dom';
import { Button } from 'carbon-addons-iot-react';

import 'carbon-addons-iot-react/css/carbon-addons-iot-react.css';

const App = () => (
  <>
    <Button>Hello world</Button>
  </>
);

render(<App />, document.getElementById('root'));
