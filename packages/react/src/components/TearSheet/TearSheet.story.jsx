import React, { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import Button from '../Button';

import TearSheetWrapper from './TearSheetWrapper';
import TearSheet from './TearSheet';

export const Default = () => <TearSheet1 />;
export default {
  title: 'TearSheet',
  decorators: [withKnobs],
  component: Default,
};

const TearSheet1 = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button style={{ margin: '8rem 0 0 8rem' }} onClick={() => setOpen(true)}>
        Show TearSheet
      </Button>

      <TearSheetWrapper isOpen={isOpen} onCloseAllTearSheets={() => setOpen(false)}>
        <TearSheet
          title="First sheet"
          description="Generic description"
          onClose={() => setOpen(false)}
        >
          {(idx, openNextSheet, goToPreviousSheet) => (
            <div
              style={{
                width: '1000px',
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Button
                kind="tertiary"
                onClick={openNextSheet}
                style={{ margin: '2rem 2rem 0 2rem', maxWidth: '13rem' }}
              >
                Open 2nd sheet
              </Button>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <Button
                  onClick={() => {
                    setOpen(false);
                    goToPreviousSheet();
                  }}
                  style={{ height: '4rem', width: '17rem' }}
                  kind="secondary"
                >
                  Close
                </Button>
                <Button style={{ height: '4rem', width: '17rem' }} kind="primary">
                  Save
                </Button>
              </div>
            </div>
          )}
        </TearSheet>
        <TearSheet title="Second sheet" description="Generic description">
          {(idx, openNextSheet, goToPreviousSheet, closeAllTearSheets) => (
            <div
              style={{
                width: '1000px',
                height: '100%',
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ padding: '1rem 2rem' }}>
                <Button onClick={closeAllTearSheets} style={{ marginBottom: '2rem' }}>
                  Close all TearSheets
                </Button>

                <h1>Lorem ipsum dolor</h1>
                <h2 style={{ padding: '1rem 0' }}>sit amet</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis
                  mi, et finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo,
                  augue massa hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa
                  ante, viverra convallis est ultrices ac. Morbi sem massa, dictum id felis ut,
                  ullamcorper aliquet nisl. Nulla feugiat lectus sodales neque pulvinar maximus. Sed
                  consequat ipsum ac dignissim consequat. Nulla blandit, tellus non dignissim
                  consectetur, augue enim placerat arcu, vitae volutpat massa urna sit amet tortor.
                  Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis orci, nec efficitur
                  massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
                  consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet
                  ultricies elementum. In et nisl porttitor, accumsan felis consequat, efficitur
                  tortor. Aliquam egestas, diam id vestibulum convallis, justo nibh placerat libero,
                  a vehicula nibh turpis ac mauris. Sed non justo turpis.
                </p>
                <h1>Lorem ipsum dolor</h1>
                <h2 style={{ padding: '1rem 0' }}>sit amet</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis
                  mi, et finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo,
                  augue massa hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa
                  ante, viverra convallis est ultrices ac. Morbi sem massa, dictum id felis ut,
                  ullamcorper aliquet nisl. Nulla feugiat lectus sodales neque pulvinar maximus. Sed
                  consequat ipsum ac dignissim consequat. Nulla blandit, tellus non dignissim
                  consectetur, augue enim placerat arcu, vitae volutpat massa urna sit amet tortor.
                  Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis orci, nec efficitur
                  massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
                  consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet
                  ultricies elementum. In et nisl porttitor, accumsan felis consequat, efficitur
                  tortor. Aliquam egestas, diam id vestibulum convallis, justo nibh placerat libero,
                  a vehicula nibh turpis ac mauris. Sed non justo turpis.
                </p>
                <h1>Lorem ipsum dolor</h1>
                <h2 style={{ padding: '1rem 0' }}>sit amet</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis
                  mi, et finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo,
                  augue massa hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa
                  ante, viverra convallis est ultrices ac. Morbi sem massa, dictum id felis ut,
                  ullamcorper aliquet nisl. Nulla feugiat lectus sodales neque pulvinar maximus. Sed
                  consequat ipsum ac dignissim consequat. Nulla blandit, tellus non dignissim
                  consectetur, augue enim placerat arcu, vitae volutpat massa urna sit amet tortor.
                  Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis orci, nec efficitur
                  massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
                  consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet
                  ultricies elementum. In et nisl porttitor, accumsan felis consequat, efficitur
                  tortor. Aliquam egestas, diam id vestibulum convallis, justo nibh placerat libero,
                  a vehicula nibh turpis ac mauris. Sed non justo turpis.
                </p>
              </div>
            </div>
          )}
        </TearSheet>
      </TearSheetWrapper>
    </>
  );
};
