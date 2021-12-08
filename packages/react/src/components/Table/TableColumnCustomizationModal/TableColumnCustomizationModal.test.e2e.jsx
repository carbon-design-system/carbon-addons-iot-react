import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../../constants/Settings';

import TableColumnCustomizationModal from './TableColumnCustomizationModal';
import { getColumns } from './tableColumnCustomizationTestUtils';

const { iotPrefix } = settings;

const getCallbacks = () => ({
  onClose: cy.stub(),
  onChange: cy.stub(),
  onReset: cy.stub(),
  onSave: cy.stub(),
  onLoadMore: cy.stub(),
});

const getDefaultProps = () => ({
  ...getCallbacks(),
  availableColumns: getColumns(),
  initialOrdering: [],
  open: true,
});

describe('TableColumnCustomizationModal', () => {
  it('allows drag and drop without groups', () => {
    const defaultProps = getDefaultProps();
    const onSave = cy.stub();
    const onChange = cy.stub();

    mount(
      <div style={{ width: 400, height: 600 }}>
        <TableColumnCustomizationModal
          {...defaultProps}
          onChange={onChange}
          onSave={onSave}
          initialOrdering={[{ columnId: 'string' }, { columnId: 'date' }, { columnId: 'select' }]}
        />
      </div>
    );
    // Drag the column string and drop it at the bottom of the list
    cy.get(`.${iotPrefix}--list-builder__selected .${iotPrefix}--list-item div[title="String"]`)
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onChange).to.be.calledWith(['date', 'select', 'string']);
      });

    cy.findAllByTestId('table-column-customization-modal-modal-primary-button')
      .click({ force: true })
      .then(() => {
        expect(onSave).to.be.calledWith(
          [
            { columnId: 'date', isHidden: false },
            { columnId: 'select', isHidden: false },
            { columnId: 'string', isHidden: false },
          ],
          [
            { id: 'date', name: 'Date' },
            { id: 'select', name: 'Select' },
            { id: 'string', name: 'String' },
          ]
        );
      });
  });

  it('allows drag and drop within groups', () => {
    const defaultProps = getDefaultProps();
    const onSave = cy.stub();
    const onChange = cy.stub();

    mount(
      <div style={{ width: 400, height: 600 }}>
        <TableColumnCustomizationModal
          {...defaultProps}
          onChange={onChange}
          onSave={onSave}
          initialOrdering={[{ columnId: 'string' }, { columnId: 'date' }, { columnId: 'select' }]}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['string', 'date', 'select'] },
          ]}
        />
      </div>
    );
    // Drag the column string and drop it at the bottom of the group
    cy.get(`.${iotPrefix}--list-builder__selected .${iotPrefix}--list-item div[title="String"]`)
      .drag(':nth-child(4) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onChange).to.be.calledWith(['date', 'select', 'string']);
      });

    cy.findAllByTestId('table-column-customization-modal-modal-primary-button')
      .click({ force: true })
      .then(() => {
        expect(onSave).to.be.calledWith(
          [
            { columnId: 'date', isHidden: false },
            { columnId: 'select', isHidden: false },
            { columnId: 'string', isHidden: false },
          ],
          [
            { id: 'date', name: 'Date' },
            { id: 'select', name: 'Select' },
            { id: 'string', name: 'String' },
          ]
        );
      });
  });

  it('does not allow drag and drop outside of groups', () => {
    const defaultProps = getDefaultProps();
    const onSave = cy.stub();
    const onChange = cy.stub();

    mount(
      <div style={{ width: 400, height: 600 }}>
        <TableColumnCustomizationModal
          {...defaultProps}
          onChange={onChange}
          onSave={onSave}
          initialOrdering={[
            { columnId: 'string' },
            { columnId: 'date' },
            { columnId: 'select' },
            { columnId: 'secretField' },
          ]}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['string', 'date', 'select'] },
          ]}
        />
      </div>
    );
    // Drag the column string and drop it on the first column outside below the group
    cy.get(`.${iotPrefix}--list-builder__selected .${iotPrefix}--list-item div[title="String"]`)
      .drag(':nth-child(5) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onChange).not.to.be.called;
      });

    cy.findAllByTestId('table-column-customization-modal-modal-primary-button')
      .click({ force: true })
      .then(() => {
        expect(onSave).to.be.calledWith(
          [
            { columnId: 'string', isHidden: false },
            { columnId: 'date', isHidden: false },
            { columnId: 'select', isHidden: false },
            { columnId: 'secretField', isHidden: false },
          ],
          [
            { id: 'string', name: 'String' },
            { id: 'date', name: 'Date' },
            { id: 'select', name: 'Select' },
            { id: 'secretField', name: 'Secret Information' },
          ]
        );
      });
  });

  it('does not allow non group members to be droped in the group', () => {
    const defaultProps = getDefaultProps();
    const onSave = cy.stub();
    const onChange = cy.stub();

    mount(
      <div style={{ width: 400, height: 600 }}>
        <TableColumnCustomizationModal
          {...defaultProps}
          onChange={onChange}
          onSave={onSave}
          initialOrdering={[
            { columnId: 'string' },
            { columnId: 'date' },
            { columnId: 'select' },
            { columnId: 'secretField' },
          ]}
          groupMapping={[
            { id: 'groupA', name: 'Group A', columnIds: ['string', 'date', 'select'] },
          ]}
        />
      </div>
    );
    // Drag the column secretField from outside the group and drop it in the group
    cy.get(
      `.${iotPrefix}--list-builder__selected .${iotPrefix}--list-item div[title="Secret Information"]`
    )
      .drag(':nth-child(3) > [draggable="true"]', { position: 'bottom' })
      .then(() => {
        expect(onChange).not.to.be.called;
      });

    cy.findAllByTestId('table-column-customization-modal-modal-primary-button')
      .click({ force: true })
      .then(() => {
        expect(onSave).to.be.calledWith(
          [
            { columnId: 'string', isHidden: false },
            { columnId: 'date', isHidden: false },
            { columnId: 'select', isHidden: false },
            { columnId: 'secretField', isHidden: false },
          ],
          [
            { id: 'string', name: 'String' },
            { id: 'date', name: 'Date' },
            { id: 'select', name: 'Select' },
            { id: 'secretField', name: 'Secret Information' },
          ]
        );
      });
  });
});
