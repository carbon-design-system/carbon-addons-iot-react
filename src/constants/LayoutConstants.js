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
  XSMALL_WIDE: 'XSMALL_WIDE',
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
  TABLE: 'TABLE',
  DONUT: 'DONUT',
  PIE: 'PIE',
  BAR: 'BAR',
};

export const DASHBOARD_SIZES = {
  XLARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  XSMALL: 'xs',
};

export const DASHBOARD_COLUMNS = {
  xl: 12,
  lg: 12,
  md: 12,
  sm: 6,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS = {
  xl: 1800,
  lg: 1056,
  md: 800,
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
    xl: { w: 1, h: 1 },
    lg: { w: 2, h: 1 },
    md: { w: 3, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 2, h: 1 },
  },
  XSMALL_WIDE: {
    xl: { w: 3, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 6, h: 1 },
    xs: { w: 4, h: 1 },
  },
  SMALL: {
    xl: { w: 2, h: 2 },
    lg: { w: 3, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 3, h: 2 },
    xs: { w: 4, h: 2 },
  },
  TALL: {
    xl: { w: 2, h: 4 },
    lg: { w: 3, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 3, h: 4 },
    xs: { w: 4, h: 4 },
  },
  MEDIUM: {
    xl: { w: 4, h: 2 },
    lg: { w: 6, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 6, h: 2 },
    xs: { w: 4, h: 2 },
  },
  WIDE: {
    xl: { w: 6, h: 2 },
    lg: { w: 9, h: 2 },
    md: { w: 12, h: 2 },
    sm: { w: 6, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGE: {
    xl: { w: 4, h: 4 },
    lg: { w: 6, h: 4 },
    md: { w: 6, h: 4 },
    sm: { w: 6, h: 4 },
    xs: { w: 4, h: 4 },
  },
  XLARGE: {
    xl: { w: 6, h: 4 },
    lg: { w: 12, h: 4 },
    md: { w: 12, h: 4 },
    sm: { w: 6, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

export const CARD_LAYOUTS = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

export const CARD_TITLE_HEIGHT = 48;
export const CARD_CONTENT_PADDING = 16;
