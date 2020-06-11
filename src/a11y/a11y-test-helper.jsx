import React from 'react';

// eslint-disable-next-line react/prop-types
const HTMLWrap = ({ children }) => (
  <html lang="en">
    <head>
      <title>a11y testing</title>
    </head>
    <body>
      <header>
        <nav>
          <a href="#main">Skipt to content</a>
        </nav>
      </header>
      <main id="main">{children}</main>
    </body>
  </html>
);

export default HTMLWrap;
