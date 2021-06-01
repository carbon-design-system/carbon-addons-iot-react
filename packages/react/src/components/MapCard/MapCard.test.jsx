import React, { useEffect, useRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Cloud32,
  Cloudy32,
  Fog32,
  Hail32,
  PartlyCloudy32,
  Rain32,
  Sun32,
  ChevronRight32,
} from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import MapCard from './MapCard';

const { iotPrefix } = settings;

describe('MapCards', () => {
  const settingsContentMock = jest.fn().mockReturnValue(<div>I am settings</div>);

  const MapImplementationMock = () => {
    const mapContainerRef = useRef(null);
    useEffect(() => {
      const hostElement = mapContainerRef.current;
      hostElement.appendChild(document.createTextNode('I am map'));
    });
    return (
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={mapContainerRef}
        stops={[]}
        onZoomIn={jest.fn()}
        onZoomOut={jest.fn()}
        settingsContent={settingsContentMock}
      />
    );
  };

  it('renders a map inside the card', () => {
    render(<MapImplementationMock />);
    const cardContent = screen.getByTestId('map-card-content');
    expect(within(cardContent).getByText('I am map')).toBeVisible();
  });

  it('adds zoom controls with callbacks', () => {
    const zoomInCallback = jest.fn();
    const zoomOutCallback = jest.fn();

    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={zoomInCallback}
        onZoomOut={zoomOutCallback}
        settingsContent={settingsContentMock}
      />
    );

    const zoomInBtn = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.zoomIn,
    });
    expect(zoomInCallback).not.toHaveBeenCalled();
    userEvent.click(zoomInBtn);
    expect(zoomInCallback).toHaveBeenCalled();

    const zoomOutBtn = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.zoomOut,
    });
    expect(zoomOutCallback).not.toHaveBeenCalled();
    userEvent.click(zoomOutBtn);
    expect(zoomOutCallback).toHaveBeenCalled();
  });

  it('shows normal legend without title', () => {
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[
          ['Thing A', 'red'],
          ['Thing B', 'green'],
        ]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
      />
    );

    const thingA = screen.getByText('Thing A');
    expect(thingA).toBeVisible();
    expect(thingA.closest('div').children[0]).toHaveStyle({
      backgroundColor: 'red',
    });

    const thingB = screen.getByText('Thing B');
    expect(thingB).toBeVisible();
    expect(thingB.closest('div').children[0]).toHaveStyle({
      backgroundColor: 'green',
    });

    expect(screen.getByTestId('map-card-legend')).not.toHaveClass(
      `${iotPrefix}--map-legend__fullwidth`
    );
    expect(screen.queryByTitle(MapCard.defaultProps.i18n.legendTitle)).not.toBeInTheDocument();
  });

  it('shows full width legend with title ', () => {
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[
          ['Thing A', 'red'],
          ['Thing B', 'green'],
        ]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        isLegendFullWidth
      />
    );

    const thingA = screen.getByText('Thing A');
    expect(thingA).toBeVisible();
    expect(thingA.closest('div').children[0]).toHaveStyle({
      backgroundColor: 'red',
    });

    expect(screen.getByTitle(MapCard.defaultProps.i18n.legendTitle)).toBeVisible();
    expect(screen.getByTestId('map-card-legend')).toHaveClass(
      `${iotPrefix}--map-legend__fullwidth`
    );
  });

  it('shows full width legend toggle arrow correct in RTL', () => {
    document.documentElement.setAttribute('dir', 'rtl');

    const { container, rerender } = render(<ChevronRight32 />);
    const chevronRightIconContent = container.querySelector('svg path').getAttribute('d');

    rerender(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[
          ['Thing A', 'red'],
          ['Thing B', 'green'],
        ]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        isLegendFullWidth
      />
    );

    const toggleButton = screen.getByLabelText(MapCard.defaultProps.i18n.hideLegend);
    expect(toggleButton.firstChild).toHaveAttribute('d', chevronRightIconContent);

    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('allows user to toggle full width legend', () => {
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[
          ['Thing A', 'red'],
          ['Thing B', 'green'],
        ]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        isLegendFullWidth
      />
    );

    expect(screen.getByTestId('map-card-legend')).not.toHaveClass(
      `${iotPrefix}--map-legend__fullwidth--collapsed`
    );
    const hideLegendButton = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.hideLegend,
    });
    expect(hideLegendButton).toBeVisible();

    // Toggle legend to collapse
    userEvent.click(hideLegendButton);
    expect(screen.getByTestId('map-card-legend')).toHaveClass(
      `${iotPrefix}--map-legend__fullwidth--collapsed`
    );
    const showLegendButton = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.showLegend,
    });
    expect(showLegendButton).toBeVisible();

    // Toggle show
    userEvent.click(showLegendButton);
    expect(screen.getByTestId('map-card-legend')).not.toHaveClass(
      `${iotPrefix}--map-legend__fullwidth--collapsed`
    );
  });

  it('can only show settings panel when card is expanded', () => {
    const cardActionCallback = jest.fn();
    const { rerender, container } = render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={() => <div>My settings</div>}
        availableActions={{ settings: true }}
        onCardAction={cardActionCallback}
        isSettingPanelOpen={false}
        isExpanded={false}
      />
    );

    expect(
      screen.queryByRole('button', {
        name: 'Settings',
      })
    ).not.toBeInTheDocument();

    rerender(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={() => <div>My settings</div>}
        availableActions={{ settings: true }}
        onCardAction={cardActionCallback}
        isSettingPanelOpen={false}
        isExpanded
      />
    );

    const showSettingsBtn = screen.getByRole('button', {
      name: 'Settings',
    });

    expect(showSettingsBtn).toBeVisible();
    // Using the class modifier "__open" to determine if the settings panel is open since
    // the actual settings panel is never really hidden, just pushed outside the container
    // which the testing library can't detect.
    expect(container.querySelectorAll(`.${iotPrefix}--map-settings__open`).length).toBeFalsy();

    userEvent.click(showSettingsBtn);
    expect(cardActionCallback).toHaveBeenCalledWith('map-card', 'ON_SETTINGS_CLICK');
  });

  it('shows custom settings panel when card is expanded and isSettingPanelOpen:true', () => {
    const { container } = render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={() => <div>My settings</div>}
        availableActions={{ settings: true }}
        onCardAction={() => {}}
        isSettingPanelOpen
        isExpanded
      />
    );

    const showSettingsBtn = screen.getByRole('button', {
      name: 'Settings',
    });

    expect(showSettingsBtn).toBeVisible();

    // Using the class modifier "__open" to determine if the settings panel is open since
    // the actual settings panel is never really hidden, just pushed outside the container
    // which the testing library doesn't detect.
    expect(container.querySelectorAll(`.${iotPrefix}--map-settings__open`).length).toBeTruthy();
  });

  it('fires card action callback when user clicks map configuration close button', () => {
    const onCardActionCallback = jest.fn();
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={() => <div>My settings</div>}
        availableActions={{ settings: true }}
        onCardAction={onCardActionCallback}
        isSettingPanelOpen
        isExpanded
      />
    );

    const settingsHeader = screen
      .getByText(MapCard.defaultProps.i18n.configurationTitle)
      .closest('div');
    const closeButton = within(settingsHeader).getByRole('button', {
      name: 'Close',
    });

    expect(closeButton).toBeVisible();
    userEvent.click(closeButton);

    expect(onCardActionCallback).toHaveBeenCalledWith('map-card', CARD_ACTIONS.ON_SETTINGS_CLICK);
  });

  it('can add layered map controls with callbacks', () => {
    const rainyClickCallback = jest.fn();
    const sunnyClickCallback = jest.fn();

    const layeredMapControls = [
      {
        id: 'test-id1',
        icon: Rain32,
        iconDescription: 'Rainy',
        onClick: rainyClickCallback,
      },
      {
        id: 'test-id2',
        icon: Sun32,
        iconDescription: 'Sunny',
        onClick: sunnyClickCallback,
      },
    ];
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        layeredControls={layeredMapControls}
      />
    );

    const triggerButton = screen.getByRole('button', {
      name: 'Layered controls',
    });
    expect(triggerButton.closest('.iot--map-controls-layers__open')).toBe(null);

    userEvent.click(triggerButton);
    expect(triggerButton.closest('.iot--map-controls-layers__open')).not.toBe(null);

    const rainyButton = screen.getByRole('button', {
      name: 'Rainy',
    });
    userEvent.click(rainyButton);
    expect(rainyClickCallback).toHaveBeenCalled();
  });

  it('can add "selactable" layered map controls', () => {
    const layeredMapControls = [
      {
        id: 'test-id1',
        icon: Rain32,
        iconDescription: 'Rainy',
        onClick: () => {},
        kind: 'icon-selection',
        selected: false,
      },
      {
        id: 'test-id2',
        icon: Sun32,
        iconDescription: 'Sunny',
        onClick: () => {},
        kind: 'icon-selection',
        selected: true,
      },
    ];
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        layeredControls={layeredMapControls}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Layered controls',
      })
    );

    const sunnyButton = screen.getByRole('button', {
      name: 'Sunny',
    });
    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);
    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection--selected`);

    const rainyButton = screen.getByRole('button', {
      name: 'Rainy',
    });
    expect(rainyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);
  });

  it('can add map controls with callbacks', () => {
    const rainyClickCallback = jest.fn();
    const sunnyClickCallback = jest.fn();
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        mapControls={[
          {
            id: 'test-id1',
            icon: Rain32,
            iconDescription: 'Rainy',
            onClick: rainyClickCallback,
          },
          {
            id: 'test-id2',
            icon: Sun32,
            iconDescription: 'Sunny',
            onClick: sunnyClickCallback,
          },
        ]}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Layered controls',
      })
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Rainy',
      })
    );
    expect(rainyClickCallback).toHaveBeenCalled();

    userEvent.click(
      screen.getByRole('button', {
        name: 'Sunny',
      })
    );
    expect(sunnyClickCallback).toHaveBeenCalled();
  });

  it('can add "selectable" map controls', () => {
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        mapControls={[
          {
            id: 'test-id1',
            icon: Rain32,
            iconDescription: 'Rainy',
            onClick: () => {},
            kind: 'icon-selection',
            selected: false,
          },
          {
            id: 'test-id2',
            icon: Sun32,
            iconDescription: 'Sunny',
            onClick: () => {},
            kind: 'icon-selection',
            selected: true,
          },
        ]}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Layered controls',
      })
    );

    const sunnyButton = screen.getByRole('button', {
      name: 'Sunny',
    });
    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);
    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection--selected`);

    const rainyButton = screen.getByRole('button', {
      name: 'Rainy',
    });
    expect(rainyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);
  });

  it('can add "grouped" map controls with callbacks', () => {
    const rainyClickCallback = jest.fn();
    const sunnyClickCallback = jest.fn();
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        mapControls={[
          {
            group: [
              {
                id: 'test-id1',
                icon: Rain32,
                iconDescription: 'Rainy',
                onClick: rainyClickCallback,
              },
              {
                id: 'test-id2',
                icon: Sun32,
                iconDescription: 'Sunny',
                onClick: sunnyClickCallback,
              },
            ],
          },
        ]}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Layered controls',
      })
    );

    expect(
      screen
        .getByRole('button', {
          name: 'Sunny',
        })
        .closest('div')
    ).toHaveClass(`${iotPrefix}--map-controls-btn-group`);

    userEvent.click(
      screen.getByRole('button', {
        name: 'Rainy',
      })
    );
    expect(rainyClickCallback).toHaveBeenCalled();

    userEvent.click(
      screen.getByRole('button', {
        name: 'Sunny',
      })
    );
    expect(sunnyClickCallback).toHaveBeenCalled();
  });

  it('can add "grouped" and "selectable" map controls with callbacks', () => {
    const rainyClickCallback = jest.fn();
    const sunnyClickCallback = jest.fn();
    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        mapControls={[
          {
            group: [
              {
                id: 'test-id1',
                icon: Rain32,
                iconDescription: 'Rainy',
                onClick: rainyClickCallback,
                kind: 'icon-selection',
                selected: false,
              },
              {
                id: 'test-id2',
                icon: Sun32,
                iconDescription: 'Sunny',
                onClick: sunnyClickCallback,
                kind: 'icon-selection',
                selected: true,
              },
            ],
          },
        ]}
      />
    );

    userEvent.click(
      screen.getByRole('button', {
        name: 'Layered controls',
      })
    );

    expect(
      screen
        .getByRole('button', {
          name: 'Sunny',
        })
        .closest('div')
    ).toHaveClass(`${iotPrefix}--map-controls-btn-group`);

    const sunnyButton = screen.getByRole('button', {
      name: 'Sunny',
    });
    const rainyButton = screen.getByRole('button', {
      name: 'Rainy',
    });

    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);
    expect(sunnyButton).toHaveClass(`${iotPrefix}--btn-icon-selection--selected`);
    expect(rainyButton).toHaveClass(`${iotPrefix}--btn-icon-selection`);

    userEvent.click(rainyButton);
    expect(rainyClickCallback).toHaveBeenCalled();

    userEvent.click(sunnyButton);
    expect(sunnyClickCallback).toHaveBeenCalled();
  });

  it('can add scrollable "grouped" map controls with callbacks', () => {
    const visibleItemsCount = 4;
    const buttonHeight = 40;
    const onClickCallback = jest.fn();

    const originalScrollBy = HTMLElement.prototype.scrollBy;
    const mockScrollBy = jest.fn();
    HTMLElement.prototype.scrollBy = mockScrollBy;

    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        isExpanded
        mapControls={[
          {
            hasScroll: true,
            visibleItemsCount,
            group: [
              {
                icon: Hail32,
                iconDescription: 'Map scroll hail',
                onClick: onClickCallback,
              },
              {
                icon: Rain32,
                iconDescription: 'Map scroll rain',
                onClick: onClickCallback,
              },
              {
                icon: Fog32,
                iconDescription: 'Map scroll fog',
                onClick: onClickCallback,
              },
              {
                icon: Cloudy32,
                iconDescription: 'Map scroll cloudy',
                onClick: onClickCallback,
              },
              {
                icon: Cloud32,
                iconDescription: 'Map scroll cloud',
                onClick: onClickCallback,
              },
              {
                icon: PartlyCloudy32,
                iconDescription: 'Map scroll partly cloudy',
                onClick: onClickCallback,
              },

              {
                icon: Sun32,
                iconDescription: 'Map scroll sun',
                onClick: onClickCallback,
              },
            ],
          },
        ]}
      />
    );

    const scrollUpButton = screen.getByRole('button', { name: MapCard.defaultProps.i18n.scrollUp });
    const scrollDownButton = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.scrollDown,
    });

    // The height of the container is adjusted to show the
    // number of buttons defined in visibleItemsCount
    expect(screen.getByTestId('map-card-map-controls-scroll-controls-scroll-area')).toHaveStyle({
      '--scroll-area-height': `${visibleItemsCount * buttonHeight}px`,
    });

    expect(scrollUpButton).toBeVisible();
    expect(scrollUpButton).toHaveAttribute('disabled');
    expect(scrollDownButton).toBeVisible();
    expect(scrollDownButton).not.toHaveAttribute('disabled');

    userEvent.click(screen.getByRole('button', { name: 'Map scroll hail' }));
    userEvent.click(screen.getByRole('button', { name: 'Map scroll rain' }));
    userEvent.click(screen.getByRole('button', { name: 'Map scroll fog' }));
    userEvent.click(screen.getByRole('button', { name: 'Map scroll cloudy' }));

    expect(onClickCallback).toHaveBeenCalledTimes(4);

    userEvent.click(scrollDownButton);
    const scrollDistance = (visibleItemsCount - 1) * buttonHeight;
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 0,
      top: scrollDistance,
      behavior: 'smooth',
    });

    userEvent.click(screen.getByRole('button', { name: 'Map scroll cloud' }));
    userEvent.click(screen.getByRole('button', { name: 'Map scroll partly cloudy' }));
    userEvent.click(screen.getByRole('button', { name: 'Map scroll sun' }));

    userEvent.click(scrollUpButton);
    const scrollDistance2 = (visibleItemsCount - 1) * buttonHeight * -1;
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 0,
      top: scrollDistance2,
      behavior: 'smooth',
    });

    HTMLElement.prototype.scrollBy = originalScrollBy;
  });

  it('can handles scrollable "grouped" width visibleItemsCount:1 ', () => {
    const visibleItemsCount = 1;
    const buttonHeight = 40;
    const onClickCallback = jest.fn();

    const originalScrollBy = HTMLElement.prototype.scrollBy;
    const mockScrollBy = jest.fn();
    HTMLElement.prototype.scrollBy = mockScrollBy;

    render(
      <MapCard
        id="map-card"
        testId="map-card"
        mapContainerRef={React.createRef()}
        stops={[]}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        settingsContent={settingsContentMock}
        isExpanded
        mapControls={[
          {
            hasScroll: true,
            visibleItemsCount,
            group: [
              {
                icon: Hail32,
                iconDescription: 'Map scroll hail',
                onClick: onClickCallback,
              },
              {
                icon: Rain32,
                iconDescription: 'Map scroll rain',
                onClick: onClickCallback,
              },
            ],
          },
        ]}
      />
    );

    const scrollUpButton = screen.getByRole('button', { name: MapCard.defaultProps.i18n.scrollUp });
    const scrollDownButton = screen.getByRole('button', {
      name: MapCard.defaultProps.i18n.scrollDown,
    });

    // The height of the container is adjusted to show the
    // number of buttons defined in visibleItemsCount
    expect(screen.getByTestId('map-card-map-controls-scroll-controls-scroll-area')).toHaveStyle({
      '--scroll-area-height': `${visibleItemsCount * buttonHeight}px`,
    });

    expect(scrollUpButton).toBeVisible();
    expect(scrollDownButton).toBeVisible();

    userEvent.click(scrollDownButton);
    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 0,
      top: 40,
      behavior: 'smooth',
    });

    userEvent.click(scrollUpButton);

    expect(mockScrollBy).toHaveBeenCalledWith({
      left: 0,
      top: -40,
      behavior: 'smooth',
    });

    HTMLElement.prototype.scrollBy = originalScrollBy;
  });
});
