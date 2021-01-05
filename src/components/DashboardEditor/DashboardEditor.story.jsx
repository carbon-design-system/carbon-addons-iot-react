import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  boolean,
  text,
  object,
  array,
} from '@storybook/addon-knobs';

import { Card, Link, InlineNotification } from '../../index';
import assemblyline from '../ImageGalleryModal/images/assemblyline.jpg';
import floow_plan from '../ImageGalleryModal/images/floow_plan.png'; // eslint-disable-line camelcase
import manufacturing_plant from '../ImageGalleryModal/images/Manufacturing_plant.png'; // eslint-disable-line camelcase
import extra_wide_image from '../ImageGalleryModal/images/extra-wide-image.png'; // eslint-disable-line camelcase
import robot_arm from '../ImageGalleryModal/images/robot_arm.png'; // eslint-disable-line camelcase
import tankmodal from '../ImageGalleryModal/images/tankmodal.png';
import turbines from '../ImageGalleryModal/images/turbines.png';
import large from '../ImageGalleryModal/images/large.png';
import large_portrait from '../ImageGalleryModal/images/large_portrait.png'; // eslint-disable-line camelcase

import DashboardEditor from './DashboardEditor';

const images = [
  {
    id: 'assemblyline',
    src: assemblyline,
    alt: 'assemblyline',
    title: `custom title assemblyline that is very long a and must be managed. 
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do 
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
      ad minim veniam.`,
  },
  { id: 'floow_plan', src: floow_plan, alt: 'floow plan' },
  {
    id: 'manufacturing_plant',
    src: manufacturing_plant,
    alt: 'manufacturing plant',
  },
  { id: 'robot_arm', src: robot_arm, alt: 'robot arm' },
  { id: 'tankmodal', src: tankmodal, alt: 'tankmodal' },
  { id: 'turbines', src: turbines, alt: 'turbines' },
  { id: 'extra-wide-image', src: extra_wide_image, alt: 'extra wide image' },
  { id: 'large', src: large, alt: 'large image' },
  { id: 'large_portrait', src: large_portrait, alt: 'large image portrait' },
];

const mockDataItems = [
  { dataSourceId: 'torque_max', label: 'Torque Max' },
  { dataSourceId: 'torque_min', label: 'Torque Min' },
  { dataSourceId: 'torque_mean', label: 'Torque Mean' },
  { dataSourceId: 'temperature', label: 'Temperature' },
  { dataSourceId: 'pressure', label: 'Pressure' },
];

export default {
  title: 'Watson IoT Experimental/DashboardEditor',
  decorators: [withKnobs],

  parameters: {
    component: DashboardEditor,
  },
};

export const Default = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title={text('title', 'My dashboard')}
      getValidDataItems={() => mockDataItems}
      dataItems={mockDataItems}
      availableImages={images}
      onAddImage={action('onAddImage')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onImageDelete={action('onImageDelete')}
      onLayoutChange={action('onLayoutChange')}
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      availableDimensions={{
        deviceid: ['73000', '73001', '73002'],
        manufacturer: ['rentech', 'GHI Industries'],
      }}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

Default.story = {
  name: 'default',
};

export const WithInitialValue = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title="Custom dashboard"
      dataItems={mockDataItems}
      initialValue={{
        cards: [
          {
            id: 'Table',
            title: 'Table card',
            size: 'LARGE',
            type: 'TABLE',
            content: {
              columns: [
                {
                  dataSourceId: 'undefined',
                  label: '--',
                },
                {
                  dataSourceId: 'undefined2',
                  label: '--',
                },
              ],
            },
          },
          {
            id: 'Custom',
            title: 'Custom rendered card',
            type: 'CUSTOM',
            size: 'MEDIUM',
            value: 35,
          },
          {
            id: 'Standard',
            title: 'Default rendered card',
            type: 'VALUE',
            size: 'MEDIUM',
            content: {
              attributes: [
                {
                  dataSourceId: 'key1',
                  unit: '%',
                  label: 'Key 1',
                },
                {
                  dataSourceId: 'key2',
                  unit: 'lb',
                  label: 'Key 2',
                },
              ],
            },
          },
          {
            id: 'Timeseries',
            title: 'Timeseries',
            size: 'MEDIUMWIDE',
            type: 'TIMESERIES',
            content: {
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Pressure',
                  dataSourceId: 'pressure',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
            timeRange: 'thisWeek',
            dataSource: {
              range: {
                interval: 'week',
                count: -1,
                type: 'periodToDate',
              },
            },
          },
          {
            id: 'Bar',
            title: 'Bar',
            size: 'MEDIUM',
            type: 'BAR',
            content: {
              type: 'SIMPLE',
              layout: 'VERTICAL',
              series: [
                {
                  dataSourceId: 'pressure',
                  label: 'pressure',
                  color: '#6929c4',
                },
              ],
              timeDataSourceId: 'timestamp',
            },
          },
        ],
        layouts: {
          lg: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
          md: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
          xl: [
            { h: 4, i: 'Table', w: 8, x: 0, y: 0 },
            { h: 2, i: 'Custom', w: 4, x: 8, y: 0 },
            {
              h: 2,
              i: 'Standard',
              w: 4,
              x: 12,
              y: 0,
            },
            {
              h: 2,
              i: 'Timeseries',
              w: 8,
              x: 1,
              y: 4,
            },
          ],
        },
      }}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={[
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ]}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
    />
  </div>
);

WithInitialValue.story = {
  name: 'with initialValue',
};

export const WithCustomOnCardChange = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      title="Custom dashboard"
      dataItems={mockDataItems}
      initialValue={{
        cards: [
          {
            id: 'Timeseries',
            title: 'Untitled',
            size: 'MEDIUMWIDE',
            type: 'TIMESERIES',
            content: {
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Pressure',
                  dataSourceId: 'pressure',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
            interval: 'day',
          },
        ],
        layouts: {},
      }}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onCardChange={(card) => {
        action('onCardChange');
        return card;
      }}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={[
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ]}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithCustomOnCardChange.story = {
  name: 'with custom onCardChange',
};

export const WithNotifications = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      title={text('title', 'My dashboard')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      notification={
        <>
          <InlineNotification
            title="This is the dashboard editor"
            subtitle="Use the side panel to create or edit cards"
            kind="info"
            lowContrast
          />
          <InlineNotification
            title="Import successful"
            subtitle="The JSON import was successful"
            kind="success"
            lowContrast
          />
          <InlineNotification
            title="Data error"
            subtitle="The image provided was not able to be fetched"
            kind="error"
            lowContrast
          />
        </>
      }
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithNotifications.story = {
  name: 'with notifications',
};

export const WithBreakpointSwitcher = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      title={text('title', 'My dashboard')}
      onAddImage={action('onAddImage')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
      ])}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      breakpointSwitcher={{ enabled: true }}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

WithBreakpointSwitcher.story = {
  name: 'with breakpoint switcher',
};

export const CustomCardPreviewRenderer = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      title="Custom dashboard"
      initialValue={object('initialValue', {
        cards: [
          {
            id: 'Custom',
            title: 'Custom rendered card',
            type: 'CUSTOM',
            size: 'MEDIUM',
            value: 35,
          },
          {
            id: 'Standard',
            title: 'Default rendered card',
            type: 'VALUE',
            size: 'MEDIUM',
            content: {
              attributes: [
                {
                  dataSourceId: 'key1',
                  unit: '%',
                  label: 'Key 1',
                },
                {
                  dataSourceId: 'key2',
                  unit: 'lb',
                  label: 'Key 2',
                },
              ],
            },
          },
        ],
        layouts: {},
      })}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onLayoutChange={action('onLayoutChange')}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      i18n={{
        cardType_CUSTOM: 'Custom',
      }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      renderCardPreview={(
        cardConfig,
        cardProps,
        // These props are not used, but they could be to create your own implementation
        onSelectCard, // eslint-disable-line no-unused-vars
        onDuplicateCard, // eslint-disable-line no-unused-vars
        onRemoveCard, // eslint-disable-line no-unused-vars
        isSelected // eslint-disable-line no-unused-vars
      ) => {
        return cardConfig.type === 'CUSTOM' ? (
          <Card
            key={cardConfig.id}
            id={cardConfig.id}
            size={cardConfig.size}
            title={cardConfig.title}
            isEditable
            {...cardProps}>
            <div style={{ padding: '1rem' }}>
              This content is rendered by the renderCardPreview function. The
              &quot;value&quot; property on the card will be rendered here:
              <h3>{cardConfig.value}</h3>
            </div>
          </Card>
        ) : undefined;
      }}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

CustomCardPreviewRenderer.story = {
  name: 'custom card preview renderer',
};

export const CustomHeaderRenderer = () => (
  <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
    <DashboardEditor
      renderHeader={() => <h1>Custom Header</h1>}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

CustomHeaderRenderer.story = {
  name: 'custom header renderer',
};

export const isLoading = () => (
  <div style={{ height: 'calc(100vh - 3rem)', marginRight: '-3rem' }}>
    <DashboardEditor isLoading={boolean('isLoading', true)} />
  </div>
);

isLoading.story = {
  name: 'isLoading',
};

export const I18N = () => (
  <div style={{ height: 'calc(100vh - 6rem)' }}>
    <DashboardEditor
      title={text('title', 'My dashboard')}
      getValidDataItems={() => mockDataItems}
      dataItems={mockDataItems}
      availableImages={images}
      onAddImage={action('onAddImage')}
      onEditTitle={action('onEditTitle')}
      onImport={action('onImport')}
      onExport={action('onExport')}
      onDelete={action('onDelete')}
      onCancel={action('onCancel')}
      onSubmit={action('onSubmit')}
      onImageDelete={action('onImageDelete')}
      onLayoutChange={action('onLayoutChange')}
      isSubmitDisabled={boolean('isSubmitDisabled', false)}
      isSubmitLoading={boolean('isSubmitLoading', false)}
      availableDimensions={{
        deviceid: ['73000', '73001', '73002'],
        manufacturer: ['rentech', 'GHI Industries'],
      }}
      supportedCardTypes={array('supportedCardTypes', [
        'TIMESERIES',
        'SIMPLE_BAR',
        'GROUPED_BAR',
        'STACKED_BAR',
        'VALUE',
        'IMAGE',
        'TABLE',
        'CUSTOM',
      ])}
      i18n={{
        // dashboard header
        headerEditTitleButton: 'headerEditTitleButton',
        headerImportButton: 'headerImportButton',
        headerExportButton: 'headerExportButton',
        headerCancelButton: 'headerCancelButton',
        headerSubmitButton: 'headerSubmitButton',
        headerDeleteButton: 'headerDeleteButton',
        headerFitToScreenButton: 'headerFitToScreenButton',
        headerXlargeButton: 'headerXlargeButton',
        headerLargeButton: 'headerLargeButton',
        headerMediumButton: 'headerMediumButton',
        layoutInfoXl: 'layoutInfoXl',
        layoutInfoLg: 'layoutInfoLg',
        layoutInfoMd: 'layoutInfoMd',

        // card strings
        noDataLabel: 'noDataLabel',
        defaultCardTitle: 'defaultCardTitle',
        cloneCardLabel: 'cloneCardLabel',
        deleteCardLabel: 'deleteCardLabel',

        // card gallery
        galleryHeader: 'galleryHeader',
        addCardButton: 'addCardButton',
        openGalleryButton: 'openGalleryButton',
        closeGalleryButton: 'closeGalleryButton',
        openJSONButton: 'openJSONButton',
        searchPlaceholderText: 'searchPlaceholderText',
        cardType_TIMESERIES: 'cardType_TIMESERIES',
        cardType_SIMPLE_BAR: 'cardType_SIMPLE_BAR',
        cardType_GROUPED_BAR: 'cardType_GROUPED_BAR',
        cardType_STACKED_BAR: 'cardType_STACKED_BAR',
        cardType_VALUE: 'cardType_VALUE',
        cardType_IMAGE: 'cardType_IMAGE',
        cardType_TABLE: 'cardType_TABLE',
        cardType_ALERT: 'cardType_ALERT',
        cardType_LIST: 'cardType_LIST',

        // card form
        openEditorButton: 'openEditorButton',
        contentTabLabel: 'contentTabLabel',
        settingsTabLabel: 'settingsTabLabel',
        cardSize_SMALL: 'cardSize_small',
        cardSize_SMALLWIDE: 'cardSize_smallwide',
        cardSize_MEDIUM: 'cardSize_medium',
        cardSize_MEDIUMTHIN: 'cardSize_mediumthin',
        cardSize_MEDIUMWIDE: 'cardSize_medium wide',
        cardSize_LARGE: 'cardSize_large',
        cardSize_LARGETHIN: 'cardSize_largethin',
        cardSize_LARGEWIDE: 'cardSize_largewide',
        chartType_BAR: 'chartType_bar',
        chartType_LINE: 'chartType_line',
        barChartType_SIMPLE: 'barChartType_simple',
        barChartType_GROUPED: 'barChartType_grouped',
        barChartType_STACKED: 'barChartType_stacked',
        barChartLayout_HORIZONTAL: 'barChartType_horizontal',
        barChartLayout_VERTICAL: 'barChartType_vertical',
        errorTitle: 'errorTitle',
        modalTitle: 'modalTitle',
        modalLabel: 'modalLabel',
        modalHelpText: 'modalHelpText',
        modalIconDescription: 'modalIconDescription',
        expandBtnLabel: 'expandBtnLabel',
        modalPrimaryButtonLabel: 'modalPrimaryButtonLabel',
        modalSecondaryButtonLabel: 'modalSecondaryButtonLabel',
        cardTitle: 'cardTitle',
        description: 'description',
        size: 'size',
        selectASize: 'selectASize',
        timeRange: 'timeRange',
        selectATimeRange: 'selectATimeRange',
        last24HoursLabel: 'Last24hours',
        last7DaysLabel: 'Last7days',
        lastMonthLabel: 'Lastmonth',
        lastQuarterLabel: 'Lastquarter',
        lastYearLabel: 'Lastyear',
        thisWeekLabel: 'Thisweek',
        thisMonthLabel: 'Thismonth',
        thisQuarterLabel: 'Thisquarter',
        thisYearLabel: 'Thisyear',
        dataItemEditorTitle: 'dataItemEditorTitle',
        dataItemEditorDataItemTitle: 'dataItemEditorDataItemTitle',
        dataItemEditorDataItemLabel: 'dataItemEditorDataItemLabel',
        dataItemEditorLegendColor: 'dataItemEditorLegendColor',
        dataSeriesTitle: 'dataSeriesTitle',
        selectDataItems: 'selectDataItems',
        selectDataItem: 'selectDataItem',
        dataItem: 'dataItem',
        edit: 'edit',
        remove: 'remove',
        customize: 'customize',
        clearSelectionText: 'clearSelectionText',
        clearAllText: 'clearAllText',
        openMenuText: 'openMenuText',
        closeMenuText: 'closeMenuText',

        dataItemEditorDataSeriesTitle: 'dataItemEditorDataSeriesTitle',
        dataItemEditorValueCardTitle: 'dataItemEditorValueCardTitle',
        dataItemEditorDataItemCustomLabel: 'dataItemEditorDataItemCustomLabel',
        dataItemEditorDataItemUnit: 'dataItemEditorDataItemUnit',
        dataItemEditorDataItemFilter: 'dataItemEditorDataItemFilter',
        dataItemEditorDataItemThresholds: 'dataItemEditorDataItemThresholds',
        dataItemEditorDataItemAddThreshold:
          'dataItemEditorDataItemAddThreshold',
        dataItemEditorDataItemRemove: 'dataItemEditorDataItemRemove',
        dataItemEditorBarColor: 'dataItemEditorBarColor',
        dataItemEditorLineColor: 'dataItemEditorLineColor',
        source: 'source',
        closeButtonLabelText: 'closeButtonLabelText',
        primaryButtonLabelText: 'primaryButtonLabelText',
        secondaryButtonLabelText: 'secondaryButtonLabelText',

        // Settings for Data Series
        xAxisLabel: 'xAxisLabel',
        yAxisLabel: 'yAxisLabel',
        unitLabel: 'unitLabel',
        decimalPrecisionLabel: 'decimalPrecisionLabel',
        precisionLabel: 'precisionLabel',
        showLegendLabel: 'showLegendLabel',
        fontSize: 'fontSize',

        // Additional fields for Bar Chart
        selectGroupBy: 'selectGroupBy',
        selectCategory: 'selectCategory',
        groupBy: 'groupBy',
        subGroup: 'subGroup',
        timeInterval: 'timeInterval',
        decimalPlacesLabel: 'decimalPlacesLabel',
        layoutLabel: 'layoutLabel',
        horizontal: 'horizontal',
        vertical: 'vertical',

        // settings for Image card form
        imageFile: 'imageFile',
        editImage: 'editImage',
        image: 'image',
        close: 'close',

        displayOptions: 'displayOptions',
        colorTitleText: 'colorTitleText',
        hideMap: 'hideMap',
        hideZoom: 'hideZoom',
        zoomLevel: 'zoomLevel',
        fit: 'fit',
        fill: 'fill',
        stretch: 'stretch',
        selectAColor: 'selectAColor',

        // image card strings
        dropContainerLabelText: 'dropContainerLabelText',
        dropContainerDescText: 'dropContainerDescText',
        uploadByURLCancel: 'uploadByURLCancel',
        uploadByURLButton: 'uploadByURLButton',
        browseImages: 'browseImages',
        insertUrl: 'insertUrl',
        urlInput: 'urlInput',
        fileTooLarge: 'fileTooLarge',
        wrongFileType: (accept) =>
          `This file is not one of the accepted file types, ${accept.join(
            ', '
          )}`,
        // image gallery strings
        imageGalleryDeleteLabelText: 'imageGalleryDeleteLabelText',
        imageGalleryDeleteModalLabelText: 'imageGalleryDeleteModalLabelText',
        imageGalleryDeleteModalTitleText: (image) =>
          `imageGalleryDeleteModalTitleText: ${image}?`,
        imageGalleryGridButtonText: 'imageGalleryGridButtonText',
        imageGalleryInstructionText: 'imageGalleryInstructionText',
        imageGalleryListButtonText: 'imageGalleryListButtonText',
        imageGalleryModalLabelText: 'imageGalleryModalLabelText',
        imageGalleryModalTitleText: 'imageGalleryModalTitleText',
        imageGalleryModalPrimaryButtonLabelText:
          'imageGalleryModalPrimaryButtonLabelText',
        imageGalleryModalSecondaryButtonLabelText:
          'imageGalleryModalSecondaryButtonLabelText',
        imageGalleryModalCloseIconDescriptionText:
          'imageGalleryModalCloseIconDescriptionText',
        imageGallerySearchPlaceHolderText: 'imageGallerySearchPlaceHolderText',
      }}
      breakpointSwitcher={{ enabled: true }}
      headerBreadcrumbs={[
        <Link href="www.ibm.com">Dashboard library</Link>,
        <Link href="www.ibm.com">Favorites</Link>,
      ]}
      isLoading={boolean('isLoading', false)}
    />
  </div>
);

I18N.story = {
  name: 'i18N',
};
