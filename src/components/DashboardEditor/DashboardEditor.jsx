import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { settings } from '../../constants/Settings';
import { CARD_SIZES, CARD_ACTIONS } from '../../constants/LayoutConstants';
import { DashboardGrid, Card, CardEditor } from '../../index';

const { iotPrefix } = settings;

const defaultProps = {
  initialValue: {
    cards: [],
    layouts: {},
  },
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
  const [dashboardData, setDashboardData] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = data => {
    setDashboardData({
      ...dashboardData,
      cards: [...dashboardData.cards, data],
    });
    setSelectedCardId(data.id);
  };
  const removeCard = id =>
    setDashboardData({
      ...dashboardData,
      cards: dashboardData.cards.filter(i => i.id !== id),
    });

  return (
    <div className={baseClassName}>
      <div className={`${baseClassName}--content`}>
        {renderHeader && renderHeader()}
        <div className={`${baseClassName}--preview`}>
          <DashboardGrid
            isEditable
            onBreakpointChange={newBreakpoint => console.log('onBreakpointChange', newBreakpoint)}
            onLayoutChange={(newLayout, newLayouts) =>
              setDashboardData({
                ...dashboardData,
                layouts: newLayouts,
              })
            }
          >
            {dashboardData.cards.map(i => (
              <Card
                id={i.id}
                size={i.size}
                title={i.title}
                isEditable
                availableActions={{ edit: true, delete: true }}
                onCardAction={(id, actionId) => {
                  if (actionId === CARD_ACTIONS.EDIT_CARD) {
                    setSelectedCardId(id);
                  }
                  if (actionId === CARD_ACTIONS.DELETE_CARD) {
                    removeCard(id);
                  }
                }}
              >
                <div style={{ padding: '1rem' }}>{JSON.stringify(i, null, 4)}</div>
              </Card>
            ))}
          </DashboardGrid>
          <pre style={{ paddingTop: '4rem' }}>{JSON.stringify(dashboardData, null, 4)}</pre>
        </div>
      </div>
      <CardEditor
        value={dashboardData.cards.find(i => i.id === selectedCardId)}
        onShowGallery={() => setSelectedCardId(null)}
        // NOTE: won't support changes to card ID
        onChange={cardData =>
          setDashboardData({
            ...dashboardData,
            cards: dashboardData.cards.map(i => (i.id === cardData.id ? cardData : i)),
          })
        }
        onAddCard={type =>
          addCard({
            id: uuid.v4(),
            title: `New ${type} card`,
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
