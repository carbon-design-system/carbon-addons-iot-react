import React from 'react';
import { mount } from '@cypress/react';

import ListSpinner from './ListSpinner';

describe('ListSpinner', () => {
  const listItems = Array.from(Array(6)).map((el, i) => {
    const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
    return { id: index, value: index };
  });

  it('updates selected when arrow buttons are pressed', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '04',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list').type('{downArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '05');
    cy.findByTestId('my-list-list').type('{downArrow}');
    cy.findByTestId('my-list-list').type('{downArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '01');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '05');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.findByTestId('my-list-list').type('{upArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '06');
  });

  it('updates selected when enter key is pressed', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '04',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-next-btn').type('{enter}');
    cy.get('@my-cb').should('have.been.calledWith', '05');
    cy.findByTestId('my-list-next-btn').type('{enter}');
    cy.findByTestId('my-list-next-btn').type('{enter}');
    cy.get('@my-cb').should('have.been.calledWith', '01');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.get('@my-cb').should('have.been.calledWith', '05');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.findByTestId('my-list-prev-btn').type('{enter}');
    cy.get('@my-cb').should('have.been.calledWith', '06');
  });

  it('updates selected when arrow up or arrow down are pressed', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '04',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-selected-item').type('{upArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '03');
    cy.findByTestId('my-list-selected-item').type('{downArrow}');
    cy.findByTestId('my-list-selected-item').type('{downArrow}');
    cy.findByTestId('my-list-selected-item').type('{downArrow}');
    cy.get('@my-cb').should('have.been.calledWith', '06');
  });

  it('should apply callbacks when arrow left or arrow right are pressed', () => {
    const rightArrowCallback = cy.stub().as('right-cb');
    const leftArrowCallback = cy.stub().as('left-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '04',
    };
    mount(
      <ListSpinner
        {...commonProps}
        onRightArrowClick={rightArrowCallback}
        onLeftArrowClick={leftArrowCallback}
      />
    );

    cy.findByTestId('my-list-selected-item').type('{leftArrow}');
    cy.get('@left-cb').should('have.been.called');
    cy.findByTestId('my-list-selected-item').type('{rightArrow}');
    cy.get('@right-cb').should('have.been.called');
  });

  it('updates selected when scrolled down', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '04',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: 1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '05');
    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: 1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '06');
    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: 1000,
    });
    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: 1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '01');
  });

  it('updates selected when scrolled up', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '03',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: -1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '02');
    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: -1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '01');
    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: -1000,
    });
    cy.get('@my-cb').should('have.been.calledWith', '06');
  });

  it('updates selected when swiped down', () => {
    const onClick = cy.stub().as('my-cb2');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '02',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list')
      .trigger('touchstart', {
        touches: [{ pageY: 0, pageX: 0 }],
      })
      .trigger('touchmove', {
        touches: [{ pageY: 500, pageX: 0 }],
      });
    cy.get('@my-cb2').should('have.been.calledWith', '01');
    cy.findByTestId('my-list-list')
      .trigger('touchstart', {
        touches: [{ pageY: 0, pageX: 0 }],
      })
      .trigger('touchmove', {
        touches: [{ pageY: 500, pageX: 0 }],
      });
    cy.get('@my-cb2').should('have.been.calledWith', '06');
  });

  it('updates selected when swiped up', () => {
    const onClick = cy.stub().as('my-cb2');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '05',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list')
      .trigger('touchstart', {
        touches: [{ pageY: 1000, pageX: 0 }],
      })
      .trigger('touchmove', {
        touches: [{ pageY: 0, pageX: 0 }],
      });
    cy.get('@my-cb2').should('have.been.calledWith', '06');
    cy.findByTestId('my-list-list')
      .trigger('touchstart', {
        touches: [{ pageY: 1000, pageX: 0 }],
      })
      .trigger('touchmove', {
        touches: [{ pageY: 0, pageX: 0 }],
      });
    cy.get('@my-cb2').should('have.been.calledWith', '01');
  });
});
