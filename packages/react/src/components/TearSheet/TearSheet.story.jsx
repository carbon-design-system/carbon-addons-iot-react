import React, { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import Button from '../Button';

import TearSheetWrapper from './TearSheetWrapper';
import TearSheet from './TearSheet';

const TearSheetChild = ({
  setHeaderAdditionalContent,
  clearHeaderContent,
  openNextSheet,
  goToPreviousSheet,
  onClose,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}
  >
    <Button
      kind="tertiary"
      onClick={openNextSheet}
      style={{ margin: '2rem 2rem 0', maxWidth: '13rem' }}
    >
      Open 2nd sheet
    </Button>
    <Button
      kind="tertiary"
      onClick={setHeaderAdditionalContent}
      style={{ marginLeft: '2rem', maxWidth: '13rem' }}
    >
      Set header additional content
    </Button>
    <Button
      kind="tertiary"
      onClick={clearHeaderContent}
      style={{ marginLeft: '2rem', maxWidth: '13rem' }}
    >
      Clear header additional content
    </Button>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderTop: '1px solid #e0e0e0',
        marginTop: 'auto',
      }}
    >
      <Button
        onClick={() => {
          onClose();
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
);

const TearSheetChild2 = ({ closeAllTearSheets }) => (
  <div
    style={{
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis mi, et
        finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo, augue massa
        hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa ante, viverra convallis
        est ultrices ac. Morbi sem massa, dictum id felis ut, ullamcorper aliquet nisl. Nulla
        feugiat lectus sodales neque pulvinar maximus. Sed consequat ipsum ac dignissim consequat.
        Nulla blandit, tellus non dignissim consectetur, augue enim placerat arcu, vitae volutpat
        massa urna sit amet tortor. Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis
        orci, nec efficitur massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
        consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet ultricies
        elementum. In et nisl porttitor, accumsan felis consequat, efficitur tortor. Aliquam
        egestas, diam id vestibulum convallis, justo nibh placerat libero, a vehicula nibh turpis ac
        mauris. Sed non justo turpis.
      </p>
      <h1>Lorem ipsum dolor</h1>
      <h2 style={{ padding: '1rem 0' }}>sit amet</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis mi, et
        finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo, augue massa
        hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa ante, viverra convallis
        est ultrices ac. Morbi sem massa, dictum id felis ut, ullamcorper aliquet nisl. Nulla
        feugiat lectus sodales neque pulvinar maximus. Sed consequat ipsum ac dignissim consequat.
        Nulla blandit, tellus non dignissim consectetur, augue enim placerat arcu, vitae volutpat
        massa urna sit amet tortor. Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis
        orci, nec efficitur massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
        consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet ultricies
        elementum. In et nisl porttitor, accumsan felis consequat, efficitur tortor. Aliquam
        egestas, diam id vestibulum convallis, justo nibh placerat libero, a vehicula nibh turpis ac
        mauris. Sed non justo turpis.
      </p>
      <h1>Lorem ipsum dolor</h1>
      <h2 style={{ padding: '1rem 0' }}>sit amet</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus convallis mi, et
        finibus leo volutpat sit amet. Nam consectetur, felis eu fermentum commodo, augue massa
        hendrerit leo, vel suscipit erat ante vitae enim. Ut congue massa ante, viverra convallis
        est ultrices ac. Morbi sem massa, dictum id felis ut, ullamcorper aliquet nisl. Nulla
        feugiat lectus sodales neque pulvinar maximus. Sed consequat ipsum ac dignissim consequat.
        Nulla blandit, tellus non dignissim consectetur, augue enim placerat arcu, vitae volutpat
        massa urna sit amet tortor. Duis eleifend, nisi ac feugiat cursus, nibh libero facilisis
        orci, nec efficitur massa eros ut augue. Mauris lectus ligula, lacinia quis dolor sit amet,
        consectetur tristique turpis. Morbi venenatis commodo feugiat. Sed laoreet ultricies
        elementum. In et nisl porttitor, accumsan felis consequat, efficitur tortor. Aliquam
        egestas, diam id vestibulum convallis, justo nibh placerat libero, a vehicula nibh turpis ac
        mauris. Sed non justo turpis.
      </p>
    </div>
  </div>
);

const StandardTearSheet = () => {
  const [isOpen, setOpen] = useState(false);
  const [headerAdditionalContent, setHeaderAdditionalContent] = useState(null);

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
          headerExtraContent={headerAdditionalContent}
        >
          <TearSheetChild
            onClose={() => setOpen(false)}
            setHeaderAdditionalContent={() => {
              setHeaderAdditionalContent(
                <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  Header additional content
                </div>
              );
            }}
            clearHeaderContent={() => setHeaderAdditionalContent(null)}
          />
        </TearSheet>
        <TearSheet title="Second sheet" description="Generic description">
          <TearSheetChild2 />
        </TearSheet>
      </TearSheetWrapper>
    </>
  );
};

export const Default = () => <StandardTearSheet />;
export default {
  title: '1 - Watson IoT/TearSheet',
  decorators: [withKnobs],
  component: Default,
};
