export const COLORS = {
  RED: 'rgb(217,3,103)',
  BLUE: 'rgb(25,98,253)',
  YELLOW: 'rgb(254,213,34)',
  PURPLE: '#8A3FFC',
  TEAL: '#009C98',
  MAGENTA: '#EE538B',
  CYAN: '#0072C3',
};

export const CARD_SIZES = {
  XSMALL: 'XSMALL',
  XSMALLWIDE: 'XSMALLWIDE',
  SMALL: 'SMALL',
  TALL: 'TALL',
  MEDIUM: 'MEDIUM',
  WIDE: 'WIDE',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE',
};

export const CARD_TYPES = {
  TIMESERIES: 'TIMESERIES',
  VALUE: 'VALUE',
  IMAGE: 'IMAGE',
  TABLE: 'TABLE',
  DONUT: 'DONUT',
  PIE: 'PIE',
  BAR: 'BAR',
  CUSTOM: 'CUSTOM',
  LIST: 'LIST',
};

export const DASHBOARD_SIZES = {
  MAX: 'max',
  XLARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  XSMALL: 'xs',
};

export const DASHBOARD_COLUMNS = {
  max: 16,
  xl: 16,
  lg: 16,
  md: 8,
  sm: 4,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS = {
  max: 1800,
  xl: 1312,
  lg: 1056,
  md: 672,
  sm: 480,
  xs: 320,
};

export const ROW_HEIGHT = {
  max: 128,
  xl: 128,
  lg: 128,
  md: 128,
  sm: 128,
  xs: 128,
};

/** The amount of space to preserve between cards */
export const GUTTER = 16;

/*
 * How many rows and columns should each card cross at each layout size
 */

export const CARD_DIMENSIONS = {
  XSMALL: {
    max: { w: 2, h: 1 },
    xl: { w: 2, h: 1 },
    lg: { w: 2, h: 1 },
    md: { w: 2, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 2, h: 1 },
  },
  XSMALLWIDE: {
    max: { w: 3, h: 1 },
    xl: { w: 4, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 4, h: 1 },
  },
  SMALL: {
    max: { w: 2, h: 2 },
    xl: { w: 4, h: 2 },
    lg: { w: 4, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 2, h: 2 },
    xs: { w: 4, h: 2 },
  },
  TALL: {
    max: { w: 2, h: 4 },
    xl: { w: 4, h: 4 },
    lg: { w: 4, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 2, h: 4 },
    xs: { w: 4, h: 4 },
  },
  MEDIUM: {
    max: { w: 6, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 8, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  WIDE: {
    max: { w: 8, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 12, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGE: {
    max: { w: 6, h: 4 },
    xl: { w: 8, h: 4 },
    lg: { w: 8, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  XLARGE: {
    max: { w: 8, h: 4 },
    xl: { w: 12, h: 4 },
    lg: { w: 16, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

export const CARD_LAYOUTS = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

export const CARD_TITLE_HEIGHT = 48;
export const CARD_CONTENT_PADDING = 16;

export const TIME_SERIES_TYPES = {
  BAR: 'BAR',
  LINE: 'LINE',
};
