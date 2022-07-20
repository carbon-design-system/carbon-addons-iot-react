import React from 'react';
import { mount } from '@cypress/react';

import { Link } from '../Link';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import robotArm from '../ImageGalleryModal/images/robot_arm.png';
import { settings } from '../../constants/Settings';

import DashboardEditor from './DashboardEditor';
import { images } from './DashboardEditor.story';

const { prefix } = settings;

const commonProps = {
  title: 'My dashboard',
  headerBreadcrumbs: [
    <Link href="www.ibm.com">Dashboard library</Link>,
    <Link href="www.ibm.com">Favorites</Link>,
  ],
  onImport: () => {},
  onExport: () => {},
  onCancel: () => {},
  onSubmit: () => {},
  onDelete: () => {},
  onCardSelect: () => {},
  onEditDataItems: () => {},
  supportedCardTypes: [
    'TIMESERIES',
    'SIMPLE_BAR',
    'GROUPED_BAR',
    'STACKED_BAR',
    'VALUE',
    'IMAGE',
    'TABLE',
    'CUSTOM',
  ],
};

describe('DashboardEditor', () => {
  // This test _should_ be runnable in Jest, but there's an error
  // where onDragStop is called incorrectly.
  it('should add a new image card and select it from the gallery', () => {
    const mockOnCardChange = cy.stub();
    mount(
      <DashboardEditor
        {...commonProps}
        availableImages={images}
        onCardChange={(card, template) => {
          mockOnCardChange(card, template);
          return card;
        }}
      />
    );

    cy.findByTitle('Image')
      .should('be.visible')
      .realClick()
      .should(() => {
        expect(mockOnCardChange).to.be.calledWith(
          {
            type: CARD_TYPES.IMAGE,
            size: CARD_SIZES.MEDIUM,
            title: 'Untitled',
            id: Cypress.sinon.match.string,
            content: {
              displayOption: 'contain',
              hideHotspots: false,
              hideMinimap: true,
              hideZoomControls: false,
            },
          },
          {
            cards: [],
            layouts: {},
          }
        );
        mockOnCardChange.reset();
      });

    cy.findByRole('button', { name: 'Add from gallery' }).click();
    cy.findByRole('button', { name: 'Select' })
      .should('be.visible')
      .should('have.attr', 'disabled');
    cy.findByAltText('robot arm').should('be.visible').click();
    cy.findByRole('button', { name: 'Select' }).should('not.have.attr', 'disabled');
    cy.findByRole('button', { name: 'Select' })
      .click()
      .should(() => {
        const card = {
          type: CARD_TYPES.IMAGE,
          size: CARD_SIZES.MEDIUM,
          title: 'Untitled',
          id: Cypress.sinon.match.string,
          content: {
            displayOption: 'contain',
            hideHotspots: false,
            hideMinimap: true,
            hideZoomControls: false,
          },
        };
        expect(mockOnCardChange).to.be.calledWith(
          {
            ...card,
            content: {
              ...card.content,
              alt: 'robot arm',
              id: 'robot_arm',
              src: Cypress.sinon.match.string,
            },
          },
          {
            cards: [card],
            layouts: {
              lg: Cypress.sinon.match.array,
              md: Cypress.sinon.match.array,
              sm: Cypress.sinon.match.array,
            },
          }
        );
        mockOnCardChange.reset();
      });
    cy.findByText('Untitled').should('be.visible');
    cy.findAllByAltText('robot arm').eq(0).should('be.visible');
  });

  it('should resize card and fire change events', () => {
    const mockOnCardChange = cy.stub();
    mount(
      <DashboardEditor
        {...commonProps}
        isCardResizable
        initialValue={{
          cards: [
            {
              type: CARD_TYPES.IMAGE,
              size: CARD_SIZES.MEDIUM,
              title: 'Untitled',
              id: 'a-test-image',
              content: {
                displayOption: 'contain',
                hideHotspots: false,
                hideMinimap: true,
                hideZoomControls: false,
                alt: 'robot arm',
                id: 'robot_arm',
                src: robotArm,
              },
            },
          ],
          lg: [{ i: 'a-test-image', x: 0, y: 0 }],
          md: [{ i: 'a-test-image', x: 0, y: 0 }],
          sm: [{ i: 'a-test-image', x: 0, y: 0 }],
        }}
        availableImages={images}
        onCardChange={(card, template) => {
          mockOnCardChange(card, template);
          return card;
        }}
      />
    );

    cy.get('.react-resizable-handle.react-resizable-handle-se').trigger('mousedown');
    cy.get('.react-resizable-handle.react-resizable-handle-se')
      .trigger('mousemove', 400, 0, {
        force: true,
      })
      .trigger('mouseup', { force: true })
      .should(() => {
        const card = {
          type: CARD_TYPES.IMAGE,
          size: CARD_SIZES.MEDIUM,
          title: 'Untitled',
          id: 'a-test-image',
          content: {
            displayOption: 'contain',
            hideHotspots: false,
            hideMinimap: true,
            hideZoomControls: false,
            alt: 'robot arm',
            id: 'robot_arm',
            src: Cypress.sinon.match.string,
          },
        };
        expect(mockOnCardChange).to.be.calledWith(
          {
            ...card,
            size: CARD_SIZES.MEDIUMTHICK,
          },
          {
            cards: [card],
            lg: [{ i: 'a-test-image', x: 0, y: 0 }],
            md: [{ i: 'a-test-image', x: 0, y: 0 }],
            sm: [{ i: 'a-test-image', x: 0, y: 0 }],
          }
        );
      });
  });

  // this test should be possible in jest, but the onDrag bug prevents it.
  it('should hide the modal when closing the image gallery', () => {
    mount(<DashboardEditor {...commonProps} isCardResizable={false} />);

    cy.findByRole('button', { name: 'Image' }).click();
    cy.findByRole('button', { name: 'Add from gallery' }).click();
    cy.findByText('Image gallery').should('be.visible');
    cy.findByRole('button', { name: 'Close' }).click();
    cy.findByText('Image gallery').should('not.be.visible');
  });

  it('should should upload an image into a card', () => {
    const mockOnCardChange = cy.stub();
    mount(
      <DashboardEditor
        {...commonProps}
        onCardChange={(card, template) => {
          mockOnCardChange(card, template);
          return card;
        }}
      />
    );

    cy.findByRole('button', { name: 'Image' }).click();
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('robot_arm.png')
      .then((fileContent) => {
        cy.get(`input[type="file"].${prefix}--file-input`).attachFile({
          fileContent: fileContent.toString(),
          fileName: 'robot_arm.png',
          mimeType: 'image/png',
          encoding: 'base64',
        });
      })
      .should(() => {
        expect(mockOnCardChange).to.be.called;
        const { args } = mockOnCardChange.getCall(1);
        expect(args[0]).to.have.all.keys(
          'cardDimensions',
          'children',
          'className',
          'content',
          'dashboardBreakpoints',
          'dashboardColumns',
          'id',
          'isResizable',
          'locale',
          'onFetchDynamicDemoHotspots',
          'onMouseDown',
          'onMouseUp',
          'onTouchEnd',
          'rowHeight',
          'size',
          'title',
          'type'
        );
        expect(args[0].content.id).to.equal('robot_arm.png');
        expect(args[0].content.imgState).to.equal('new');
        expect(args[1]).to.have.all.keys('cards', 'layouts');
        expect(args[1].cards[0].type).to.equal(CARD_TYPES.IMAGE);
      });
  });
});
