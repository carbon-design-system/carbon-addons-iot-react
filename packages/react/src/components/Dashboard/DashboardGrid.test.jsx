import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CARD_DIMENSIONS,
  CARD_SIZES,
  DASHBOARD_BREAKPOINTS,
} from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import ValueCard from '../ValueCard/ValueCard';
import GaugeCard from '../GaugeCard/GaugeCard';
import PieChartCard from '../PieChartCard/PieChartCard';
import TableCard from '../TableCard/TableCard';
import ImageCard from '../ImageCard/ImageCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import ListCard from '../ListCard/ListCard';
import BarChartCard from '../BarChartCard/BarChartCard';

import DashboardGrid, {
  getMatchingCardSize,
  getBreakPointSizes,
  findLayoutOrGenerate,
} from './DashboardGrid';

describe('DashboardGrid', () => {
  describe('findLayoutOrGenerate', () => {
    const layouts = {
      max: [{ i: 'mycard', x: 0, y: 0, w: 8, h: 2 }],
      xl: [{ i: 'mycard', x: 0, y: 0, w: 8, h: 2 }],
      lg: [{ i: 'mycard', x: 0, y: 0, w: 8, h: 2 }],
      md: [{ i: 'mycard', x: 0, y: 0, w: 8, h: 2 }],
      sm: [{ i: 'mycard', x: 0, y: 0, w: 4, h: 2 }],
      xs: [{ i: 'mycard', x: 0, y: 0, w: 4, h: 2 }],
    };
    it('if no layouts exist they should be generated', () => {
      const generated = findLayoutOrGenerate(
        {},
        [{ id: 'mycard', size: CARD_SIZES.MEDIUM }],
        Object.keys(DASHBOARD_BREAKPOINTS)
      );

      expect(generated).toEqual(layouts);
    });
    it('if every layout already exists, the card should have dimensions added', () => {
      const addedDimensions = findLayoutOrGenerate(
        {
          max: [{ i: 'mycard', x: 0, y: 0 }],
          xl: [{ i: 'mycard', x: 0, y: 0 }],
          lg: [{ i: 'mycard', x: 0, y: 0 }],
          md: [{ i: 'mycard', x: 0, y: 0 }],
          sm: [{ i: 'mycard', x: 0, y: 0 }],
          xs: [{ i: 'mycard', x: 0, y: 0 }],
        },
        [{ id: 'mycard', size: CARD_SIZES.MEDIUM }],
        Object.keys(DASHBOARD_BREAKPOINTS)
      );
      expect(addedDimensions).toEqual(layouts);
    });
    it('handle old layouts with bogus cards', () => {
      const emptyLayouts = findLayoutOrGenerate(
        {
          max: [
            { i: 'boguscard', x: 0, y: 0 },
            { i: 'mycard', x: 0, y: 0 },
          ],
          xl: [{ i: 'boguscard', x: 0, y: 0 }],
          lg: [{ i: 'boguscard', x: 0, y: 0 }],
          md: [{ i: 'boguscard', x: 0, y: 0 }],
          sm: [{ i: 'boguscard', x: 0, y: 0 }],
          xs: [{ i: 'boguscard', x: 0, y: 0 }],
        },
        [{ id: 'mycard', size: CARD_SIZES.MEDIUM }],
        Object.keys(DASHBOARD_BREAKPOINTS)
      );
      // the bogus card was quietly removed from the layout
      expect(emptyLayouts.max).toHaveLength(1);
    });
    it('should only find supported layouts', () => {
      const regenerated = findLayoutOrGenerate(
        { max: [], xl: [], lg: [], md: [], sm: [], xs: [] },
        [{ id: 'mycard', size: CARD_SIZES.MEDIUM }],
        ['xl', 'lg', 'md']
      );
      // should generate layouts for each existing card for each supported layout
      expect(regenerated).toEqual({
        xl: [{ h: 2, i: 'mycard', isResizable: undefined, w: 8, x: 0, y: 0 }],
        lg: [{ h: 2, i: 'mycard', isResizable: undefined, w: 8, x: 0, y: 0 }],
        md: [{ h: 2, i: 'mycard', isResizable: undefined, w: 8, x: 0, y: 0 }],
      });
    });
  });

  describe('resizing', () => {
    const BREAKPOINT = 'lg';
    const getLayouts = () => ({
      [BREAKPOINT]: [
        { i: 'card', x: 0, y: 0, w: 4, h: 1 },
        { i: 'valueCard', x: 4, y: 0, w: 4, h: 1 },
        { i: 'gaugeCard', x: 0, y: 2, w: 4, h: 2 },
        { i: 'pieChartCard', x: 4, y: 0, w: 4, h: 2 },
        { i: 'imageCard', x: 8, y: 2, w: 8, h: 2 },
        { i: 'timeSeriesCard', x: 0, y: 4, w: 4, h: 4 },
        { i: 'listCard', x: 4, y: 4, w: 4, h: 4 },
        { i: 'tableCard', x: 4, y: 4, w: 8, h: 4 },
        { i: 'barChartCard', x: 8, y: 8, w: 16, h: 4 },
      ],
    });

    const callbackMocks = {
      onBreakpointChange: jest.fn(),
      onLayoutChange: jest.fn(),
      onCardSizeChange: jest.fn(),
      onResizeStop: jest.fn(),
    };

    const getCards = ({ isResizable }) => [
      <Card
        testId="test-card"
        title="Card"
        id="card"
        key="card"
        isResizable={isResizable}
        size={CARD_SIZES.SMALL}
      />,
      <ValueCard
        testID="test-valueCard"
        title="ValueCard"
        id="valueCard"
        key="valueCard"
        size={CARD_SIZES.SMALLWIDE}
        isResizable={isResizable}
        content={{
          attributes: [],
        }}
        values={{}}
      />,
      <GaugeCard
        testID="test-gaugeCard"
        title="GaugeCard"
        id="gaugeCard"
        key="gaugeCard"
        isResizable={isResizable}
        size={CARD_SIZES.MEDIUMTHIN}
        content={{ gauges: [] }}
        values={{}}
      />,
      <PieChartCard
        testID="test-pieChartCard"
        title="PieChartCard"
        key="pieChartCard"
        id="pieChartCard"
        content={{}}
        size={CARD_SIZES.MEDIUM}
        isResizable={isResizable}
        values={[]}
      />,
      <TableCard
        testID="test-tableCard"
        title="TableCard"
        id="tableCard"
        key="tableCard"
        content={{
          columns: [],
        }}
        values={[]}
        onCardAction={() => {}}
        size={CARD_SIZES.LARGE}
        isResizable={isResizable}
      />,
      <ImageCard
        testID="test-imageCard"
        title="ImageCard"
        id="imageCard"
        key="imageCard"
        isResizable={isResizable}
        size={CARD_SIZES.LARGE}
        content={{}}
        values={{
          hotspots: [],
        }}
      />,
      <TimeSeriesCard
        testID="test-timeSeriesCard"
        title="TimeSeriesCard"
        id="timeSeriesCard"
        isResizable={isResizable}
        size={CARD_SIZES.LARGETHIN}
        chartType="LINE"
        content={{
          series: [
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
            },
          ],
        }}
        key="timeSeriesCard"
        interval="hour"
        values={[]}
      />,
      <ListCard
        testID="test-listCard"
        title="ListCard"
        id="listCard"
        key="listCard"
        isResizable={isResizable}
        size={CARD_SIZES.LARGETHIN}
        data={[]}
        hasMoreData={false}
        loadData={() => {}}
      />,
      <BarChartCard
        testId="test-barChartCard"
        title="BarChartCard"
        id="barChartCard"
        key="barChartCard"
        size={CARD_SIZES.LARGEWIDE}
        isResizable={isResizable}
        content={{
          categoryDataSourceId: 'city',
          layout: 'VERTICAL',
          series: [
            {
              dataSourceId: 'particles',
            },
          ],
          type: 'SIMPLE',
        }}
        values={[]}
      />,
    ];

    it('adds resize handles for all cards with isResizable: true', () => {
      const resizeHandleClass = 'react-resizable-handle';
      const expectToBeResizable = (testId, resizeHandleIndex = 2) => {
        const resizeHandle = screen.getByTestId(testId).childNodes[resizeHandleIndex];
        expect(resizeHandle).toHaveClass(resizeHandleClass);
        expect(resizeHandle).toBeVisible();
      };

      jest.spyOn(console, 'error').mockImplementation(() => {});
      const { rerender } = render(
        <DashboardGrid {...callbackMocks} layouts={getLayouts()} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: true })}
        </DashboardGrid>
      );
      expect(console.error).toHaveBeenCalledWith(
        `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
      );
      console.error.mockReset();

      // We test all cards
      expectToBeResizable('test-card');
      expectToBeResizable('test-valueCard');
      expectToBeResizable('test-gaugeCard');
      expectToBeResizable('test-pieChartCard');
      expectToBeResizable('test-tableCard', 1);
      expectToBeResizable('test-imageCard');
      expectToBeResizable('test-timeSeriesCard');
      expectToBeResizable('test-listCard');
      expectToBeResizable('test-barChartCard');

      const emptyLayouts = {};
      rerender(
        <DashboardGrid {...callbackMocks} layouts={emptyLayouts} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: true })}
        </DashboardGrid>
      );
      expectToBeResizable('test-card'); // base card
      expectToBeResizable('test-valueCard'); // card wrapping base card
      expectToBeResizable('test-imageCard'); // card wrapping base card with children as a function

      const layoutwithMissingCards = {
        [BREAKPOINT]: [{ i: 'nonExistingCard', x: 0, y: 0, w: 4, h: 1 }],
      };
      rerender(
        <DashboardGrid {...callbackMocks} layouts={layoutwithMissingCards} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: true })}
        </DashboardGrid>
      );
      expectToBeResizable('test-card');
      expectToBeResizable('test-valueCard');
      expectToBeResizable('test-imageCard');
    });

    it('prevents resize handles for all cards with isResizable: false', () => {
      const resizeHandleClass = 'react-resizable-handle';
      const expectNotToBeResizable = (testId, resizeHandleIndex = 2) => {
        const element = screen.getByTestId(testId).childNodes[resizeHandleIndex];
        if (element) {
          expect(element).not.toHaveClass(resizeHandleClass);
        } else {
          expect(element).toBeUndefined();
        }
      };

      const { rerender } = render(
        <DashboardGrid {...callbackMocks} layouts={getLayouts()} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: false })}
        </DashboardGrid>
      );

      expectNotToBeResizable('test-card');
      expectNotToBeResizable('test-valueCard');
      expectNotToBeResizable('test-gaugeCard');
      expectNotToBeResizable('test-pieChartCard');
      expectNotToBeResizable('test-tableCard', 1);
      expectNotToBeResizable('test-imageCard');
      expectNotToBeResizable('test-timeSeriesCard');
      expectNotToBeResizable('test-listCard');
      expectNotToBeResizable('test-barChartCard');

      const emptyLayouts = {};
      rerender(
        <DashboardGrid {...callbackMocks} layouts={emptyLayouts} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: false })}
        </DashboardGrid>
      );
      expectNotToBeResizable('test-card'); // base card
      expectNotToBeResizable('test-valueCard'); // card wrapping base card
      expectNotToBeResizable('test-imageCard'); // card wrapping base card with children as a function

      const layoutwithMissingCards = {
        [BREAKPOINT]: [{ i: 'nonExistingCard', x: 0, y: 0, w: 4, h: 1 }],
      };
      rerender(
        <DashboardGrid {...callbackMocks} layouts={layoutwithMissingCards} breakpoint={BREAKPOINT}>
          {getCards({ isResizable: false })}
        </DashboardGrid>
      );
      expectNotToBeResizable('test-card');
      expectNotToBeResizable('test-valueCard');
      expectNotToBeResizable('test-imageCard');
    });

    it('it matches dimensions (height first) to closest larger or equally large card size', () => {
      const breakpointSizes = getBreakPointSizes('xl', CARD_DIMENSIONS, CARD_SIZES);

      const size = getMatchingCardSize({ w: 1, h: 1 }, breakpointSizes);
      expect(size.name).toEqual(CARD_SIZES.SMALL);

      const sizeA = getMatchingCardSize({ w: 2, h: 1 }, breakpointSizes);
      expect(sizeA.name).toEqual(CARD_SIZES.SMALL);

      const sizeB = getMatchingCardSize({ w: 3, h: 1 }, breakpointSizes);
      expect(sizeB.name).toEqual(CARD_SIZES.SMALL);

      const sizeC = getMatchingCardSize({ w: 4, h: 1 }, breakpointSizes);
      expect(sizeC.name).toEqual(CARD_SIZES.SMALL);

      const sizeD = getMatchingCardSize({ w: 4, h: 2 }, breakpointSizes);
      expect(sizeD.name).toEqual(CARD_SIZES.MEDIUMTHIN);

      const sizeE = getMatchingCardSize({ w: 3, h: 2 }, breakpointSizes);
      expect(sizeE.name).toEqual(CARD_SIZES.MEDIUMTHIN);

      const sizeF = getMatchingCardSize({ w: 2, h: 2 }, breakpointSizes);
      expect(sizeF.name).toEqual(CARD_SIZES.MEDIUMTHIN);

      const sizeG = getMatchingCardSize({ w: 5, h: 2 }, breakpointSizes);
      expect(sizeG.name).toEqual(CARD_SIZES.MEDIUM);

      const sizeH = getMatchingCardSize({ w: 18, h: 5 }, breakpointSizes);
      expect(sizeH.name).toEqual(CARD_SIZES.LARGEWIDE);

      const sizeI = getMatchingCardSize({ w: 16, h: 2 }, breakpointSizes);
      expect(sizeI.name).toEqual(CARD_SIZES.MEDIUMWIDE);
    });

    describe('resizes properly when dragging', () => {
      const generateParentBoundingClientRect =
        ({ width }) =>
        () => {
          return {
            bottom: 206,
            height: 144,
            left: 48,
            right: width + 48,
            top: 62,
            width,
            x: 48,
            y: 62,
          };
        };
      const generateHandleBoundingClientRect =
        ({ parentWidth }) =>
        () => {
          return {
            bottom: 204,
            height: 20,
            left: parentWidth + 26,
            right: parentWidth + 46,
            top: 184,
            width: 20,
            x: parentWidth + 26,
            y: 184,
          };
        };

      const resizeHandleClass = 'react-resizable-handle';
      const getResizeHandle = (testId, resizeHandleIndex = 2) =>
        screen.getByTestId(testId).childNodes[resizeHandleIndex];

      const expectToBeResizable = (testId, resizeHandleIndex = 2) => {
        const resizeHandle = getResizeHandle(testId, resizeHandleIndex);
        expect(resizeHandle).toHaveClass(resizeHandleClass);
        expect(resizeHandle).toBeVisible();
      };

      beforeEach(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
          get() {
            return this.parentNode;
          },
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
          get() {
            return 1280;
          },
        });
      });
      afterEach(() => {
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
          get() {
            return undefined;
          },
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
          get() {
            return undefined;
          },
        });
      });
      it('does not resize the card if it was not dragged far enough', () => {
        render(
          <DashboardGrid
            {...callbackMocks}
            layouts={{ lg: [{ i: 'card', x: 0, y: 0, w: 4, h: 1 }] }}
            breakpoint="lg"
            isEditable
          >
            {[
              <Card
                testId="test-card"
                title="Card"
                id="card"
                key="card"
                isResizable
                size={CARD_SIZES.SMALL}
              />,
            ]}
          </DashboardGrid>
        );

        expectToBeResizable('test-card');

        const cardHandle = getResizeHandle('test-card');
        let width = 444;
        let clientX = 486;
        const clientY = 199;
        cardHandle.parentNode.getBoundingClientRect = generateParentBoundingClientRect({ width });
        cardHandle.getBoundingClientRect = generateHandleBoundingClientRect({ parentWidth: width });
        fireEvent.mouseDown(cardHandle, {
          clientX,
          clientY,
        });
        let distance = 20;
        while (distance >= 0) {
          width += 10;
          clientX += 10;
          cardHandle.parentNode.getBoundingClientRect = generateParentBoundingClientRect({ width });
          cardHandle.getBoundingClientRect = generateHandleBoundingClientRect({
            parentWidth: width,
          });
          fireEvent.mouseMove(cardHandle, {
            clientX,
            clientY,
            x: clientX,
            y: clientY,
          });
          distance -= 10;
        }
        fireEvent.mouseUp(cardHandle, {
          clientX,
          clientY,
        });
        expect(callbackMocks.onCardSizeChange).not.toHaveBeenCalled();
        expect(callbackMocks.onResizeStop).not.toHaveBeenCalled();
      });
      it('resizes the card when dragging far enough', () => {
        render(
          <DashboardGrid
            {...callbackMocks}
            layouts={{ lg: [{ i: 'card', x: 0, y: 0, w: 4, h: 1 }] }}
            breakpoint="lg"
            isEditable
          >
            {[
              <Card
                testId="test-card"
                title="Card"
                id="card"
                key="card"
                isResizable
                size={CARD_SIZES.SMALL}
              />,
            ]}
          </DashboardGrid>
        );

        expectToBeResizable('test-card');

        const cardHandle = getResizeHandle('test-card');
        let width = 444;
        let clientX = 486;
        const clientY = 199;
        cardHandle.parentNode.getBoundingClientRect = generateParentBoundingClientRect({ width });
        cardHandle.getBoundingClientRect = generateHandleBoundingClientRect({ parentWidth: width });
        fireEvent.mouseDown(cardHandle, {
          clientX,
          clientY,
        });
        let distance = 200;
        while (distance >= 0) {
          width += 10;
          clientX += 10;
          cardHandle.parentNode.getBoundingClientRect = generateParentBoundingClientRect({ width });
          cardHandle.getBoundingClientRect = generateHandleBoundingClientRect({
            parentWidth: width,
          });
          fireEvent.mouseMove(cardHandle, {
            clientX,
            clientY,
            x: clientX,
            y: clientY,
          });
          distance -= 10;
        }
        fireEvent.mouseUp(cardHandle, {
          clientX,
          clientY,
        });
        expect(callbackMocks.onCardSizeChange).toHaveBeenCalledWith(
          {
            id: 'card',
            size: 'SMALLWIDE',
          },
          expect.objectContaining({
            element: expect.anything(),
            event: expect.anything(),
            layout: [
              {
                h: 1,
                i: 'card',
                isBounded: undefined,
                isDraggable: undefined,
                isResizable: true,
                maxH: undefined,
                maxW: undefined,
                minH: undefined,
                minW: undefined,
                moved: false,
                resizeHandles: undefined,
                static: false,
                w: 8,
                x: 0,
                y: 0,
              },
            ],
            newItem: {
              h: 1,
              i: 'card',
              isBounded: undefined,
              isDraggable: undefined,
              isResizable: true,
              maxH: undefined,
              maxW: undefined,
              minH: undefined,
              minW: undefined,
              moved: false,
              resizeHandles: undefined,
              static: false,
              w: 8,
              x: 0,
              y: 0,
            },
            oldItem: {
              h: 1,
              i: 'card',
              isBounded: undefined,
              isDraggable: undefined,
              isResizable: true,
              maxH: undefined,
              maxW: undefined,
              minH: undefined,
              minW: undefined,
              moved: false,
              resizeHandles: undefined,
              static: false,
              w: 4,
              x: 0,
              y: 0,
            },
            placeholder: { h: 1, i: 'card', static: true, w: 8, x: 0, y: 0 },
          })
        );
        expect(callbackMocks.onResizeStop).toHaveBeenCalledWith(
          {
            id: 'card',
            size: 'SMALLWIDE',
          },
          expect.objectContaining({
            element: expect.anything(),
            event: expect.anything(),
            layout: [
              {
                h: 1,
                i: 'card',
                isBounded: undefined,
                isDraggable: undefined,
                isResizable: true,
                maxH: undefined,
                maxW: undefined,
                minH: undefined,
                minW: undefined,
                moved: false,
                resizeHandles: undefined,
                static: false,
                w: 8,
                x: 0,
                y: 0,
              },
            ],
            newItem: {
              h: 1,
              i: 'card',
              isBounded: undefined,
              isDraggable: undefined,
              isResizable: true,
              maxH: undefined,
              maxW: undefined,
              minH: undefined,
              minW: undefined,
              moved: false,
              resizeHandles: undefined,
              static: false,
              w: 8,
              x: 0,
              y: 0,
            },
            oldItem: {
              h: 1,
              i: 'card',
              isBounded: undefined,
              isDraggable: undefined,
              isResizable: true,
              maxH: undefined,
              maxW: undefined,
              minH: undefined,
              minW: undefined,
              moved: false,
              resizeHandles: undefined,
              static: false,
              w: 4,
              x: 0,
              y: 0,
            },
            placeholder: null,
          })
        );
      });
    });
  });
});
