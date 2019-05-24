export const CARD_SIZES = {
  XSMALL: 'XSMALL',
  SMALL: 'SMALL',
  TALL: 'TALL',
  MEDIUM: 'MEDIUM',
  WIDE: 'WIDE',
  LARGE: 'LARGE',
  XLARGE: 'XLARGE',
};

export const CARD_TYPES = {
  LINE: 'LINE',
  VALUE: 'VALUE',
  TABLE: 'TABLE',
};

export const DASHBOARD_COLUMNS = {
  lg: 16,
  md: 16,
  sm: 8,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS = {
  lg: 1584,
  md: 1056,
  sm: 672,
  xs: 0,
};

export const ROW_HEIGHT = {
  lg: 128,
  md: 128,
  sm: 128,
  xs: 128,
};

export const GUTTER = 16;

/*
 *
 *
 */

export const CARD_DIMENSIONS = {
  XSMALL: {
    lg: { w: 1, h: 1 },
    md: { w: 3, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 2, h: 1 },
  },
  SMALL: {
    lg: { w: 3, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  TALL: {
    lg: { w: 3, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  MEDIUM: {
    lg: { w: 5, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 8, h: 2 },
    xs: { w: 4, h: 2 },
  },
  WIDE: {
    lg: { w: 6, h: 2 },
    md: { w: 12, h: 2 },
    sm: { w: 8, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGE: {
    lg: { w: 8, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 8, h: 4 },
    xs: { w: 4, h: 4 },
  },
  XLARGE: {
    lg: { w: 12, h: 4 },
    md: { w: 16, h: 4 },
    sm: { w: 8, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

/** This is used for the min-width and min-height of the card based on the current breakpoint */
export const getCardMinSize = (
  breakpoint,
  size,
  dashboardBreakpoints = DASHBOARD_BREAKPOINTS,
  cardDimensions = CARD_DIMENSIONS,
  rowHeight = ROW_HEIGHT
) => {
  const totalCol = DASHBOARD_COLUMNS[breakpoint];
  const columnWidth = (dashboardBreakpoints[breakpoint] - (totalCol - 1) * GUTTER) / totalCol;
  const cardColumns = cardDimensions[size][breakpoint].w;
  const cardRows = cardDimensions[size][breakpoint].h;

  const cardSize = {
    x: cardColumns * columnWidth + (cardColumns - 1) * GUTTER,
    y: cardRows * rowHeight[breakpoint] + (cardRows - 1) * GUTTER,
  };
  // console.log('getCardMinSize', breakpoint, size, rowHeight, ` = ${JSON.stringify(cardSize)}`);
  return cardSize;
};

export const CARD_LAYOUTS = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

export const CARD_TITLE_HEIGHT = 48;
export const CARD_CONTENT_PADDING = 16;
