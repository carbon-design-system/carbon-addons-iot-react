import React from 'react';
import { mount } from '@cypress/react';

import useScrollIntoViewCallback from './useScrollIntoViewCallback';

describe('useScrollIntoViewCallback', () => {
  it('should call the provided callback when the last item is scrolled into view', () => {
    // eslint-disable-next-line react/prop-types
    function TestComponent({ callback }) {
      const { scrollItemRef } = useScrollIntoViewCallback(callback);
      const ids = Array(20)
        .fill()
        .map(() => Math.random());
      const items = Array.from(ids).map((e, i) => {
        return i === 19 ? (
          <li data-testid="last" ref={scrollItemRef} key={e}>
            last
          </li>
        ) : (
          <li key={e}>e</li>
        );
      });

      return <ul>{items}</ul>;
    }
    const callbackStub = cy.stub();
    mount(<TestComponent callback={callbackStub} />);

    expect(callbackStub).to.not.be.called;
    cy.findByTestId('last')
      .scrollIntoView()
      .should(() => {
        expect(callbackStub).to.be.called;
      });
  });

  it('should return without calling the callback if loading equals true', () => {
    // eslint-disable-next-line react/prop-types
    function TestComponent({ callback }) {
      const { scrollItemRef } = useScrollIntoViewCallback(callback, true);
      const ids = Array(20)
        .fill()
        .map(() => Math.random());
      const items = Array.from(ids).map((e, i) => {
        return i === 19 ? (
          <li data-testid="last" ref={scrollItemRef} key={e}>
            last
          </li>
        ) : (
          <li key={e}>e</li>
        );
      });

      return <ul>{items}</ul>;
    }
    const callbackStub = cy.stub();
    mount(<TestComponent callback={callbackStub} />);

    expect(callbackStub).to.not.be.called;
    cy.findByTestId('last')
      .scrollIntoView()
      .should(() => {
        expect(callbackStub).to.not.be.called;
      });
  });
});
