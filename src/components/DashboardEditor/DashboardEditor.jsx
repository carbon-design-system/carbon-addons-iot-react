import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { settings } from '../../constants/Settings';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import { Button, CodeSnippet, CardEditor } from '../../index';

const { iotPrefix } = settings;

const defaultProps = {
  initialValue: [],
  renderHeader: null,
};

const propTypes = {
  /** initial dashboard data to edit */
  initialValue: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  /** if provided, renders header content above preview */
  renderHeader: PropTypes.func,
};

const DashboardEditor = ({ initialValue, renderHeader }) => {
  const baseClassName = `${iotPrefix}--dashboard-editor`;

  // show the gallery if no card is being edited
  const [dashboardCards, setDashboardCards] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = data => setDashboardCards([...dashboardCards, data]);
  const removeCard = id => setDashboardCards(dashboardCards.filter(i => i.id !== id));

  return (
    <div className={baseClassName}>
      <div className={`${baseClassName}--content`}>
        {renderHeader && renderHeader()}
        <div className={`${baseClassName}--preview`}>
          <h5>Dashboard Template preview</h5>
          <div>
            As you add and edit cards, the content underneath here will be updated in real-time. We
            will replace this with the actual Dashboard component.
          </div>
          <br />
          {dashboardCards.map(i => (
            <div style={{ paddingBottom: '2rem' }}>
              <CodeSnippet type="multi" hideCopyButton style={{ width: '30rem' }}>
                {JSON.stringify(i, null, 4)}
              </CodeSnippet>
              <br />
              <Button
                style={{ marginRight: '1rem' }}
                kind="danger"
                onClick={() => removeCard(i.id)}
              >
                Delete
              </Button>
              <Button disabled={selectedCardId === i.id} onClick={() => setSelectedCardId(i.id)}>
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
      <CardEditor
        value={dashboardCards?.find(i => i.id === selectedCardId)}
        onShowGallery={() => setSelectedCardId(null)}
        // NOTE: won't support changes to card ID
        onChange={cardData =>
          setDashboardCards(dashboardCards.map(i => (i.id === cardData.id ? cardData : i)))
        }
        onAddCard={type =>
          addCard({
            id: uuid.v4(),
            title: 'New card',
            size: CARD_SIZES.SMALL,
            type,
          })
        }
      />
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
