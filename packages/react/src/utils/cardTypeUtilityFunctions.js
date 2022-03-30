import { CARD_TYPES } from '../constants/LayoutConstants';

export const getChartOptions = (type, hasData, content) => {
  const basicOptionsObject = {
    color: content.colors,
    animations: false,
    accessibility: true,
    toolbar: {
      enabled: false,
    },
    legend: {
      position: content.legendPosition,
      enabled: hasData,
      truncation: content.truncation,
    },
  };

  return type === CARD_TYPES.METER_CHART
    ? {
        ...basicOptionsObject,
        containerResizable: true,
        meter: {
          peak: content.peak,
          proportional: {
            total: content.meterTotal,
            unit: content.meterUnit,
          },
          status: {
            ranges: [
              ...(content?.status?.success
                ? [
                    {
                      range: content.status.success,
                      status: 'success',
                    },
                  ]
                : []),
              ...(content?.status?.warning
                ? [
                    {
                      range: content.status.warning,
                      status: 'warning',
                    },
                  ]
                : []),
              ...(content?.status?.danger
                ? [
                    {
                      range: content.status.danger,
                      status: 'danger',
                    },
                  ]
                : []),
            ],
          },
        },
      }
    : type === CARD_TYPES.SPARKLINE_CHART
    ? {
        ...basicOptionsObject,
        grid: {
          x: {
            enabled: false,
          },
          y: {
            enabled: false,
          },
        },
        axes: {
          bottom: {
            visible: false,
            title: content.xLabel,
            mapsTo: content.xProperty,
            thresholds: content.xThresholds,
            scaleType: 'time',
          },
          left: {
            visible: false,
            title: content.yLabel,
            mapsTo: content.yProperty,
            thresholds: content.yThresholds,
            scaleType: 'linear',
          },
        },
        points: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
      }
    : type === CARD_TYPES.STACKED_AREA_CHART
    ? {
        ...basicOptionsObject,
        axes: {
          left: {
            stacked: true,
            title: content.yLabel,
            mapsTo: content.yProperty,
            thresholds: content.yThresholds,
            scaleType: 'linear',
          },
          bottom: {
            title: content.xLabel,
            mapsTo: content.xProperty,
            thresholds: content.xThresholds,
            scaleType: 'time',
          },
        },
        curve: content.curve,
      }
    : content;
};
