/**
 * @jest-environment node
 */

// Baseline smoke test for SSR, based on the example from react-transition-group
// https://github.com/reactjs/react-transition-group/pull/619/files
// test that import does not crash
import * as CarbonAddonsIoTReact from '../../index'; // eslint-disable-line no-unused-vars

describe('SSR', () => {
  it('should import carbon-addons-iot-react in node env', () => {
    expect(CarbonAddonsIoTReact).toBeTruthy();
  });
});
