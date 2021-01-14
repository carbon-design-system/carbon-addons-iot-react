import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { g10 } from '@carbon/themes';

import Hotspot from './Hotspot';
import HotspotContent from './HotspotContent';

const { text01, ui03 } = g10;

describe('Hotspot', () => {
  it('uses size and position', () => {
    render(
      <Hotspot content={<HotspotContent />} x={10} y={5} height={50} width={200} type="fixed" />
    );

    const hotspotContainer = screen.getByTestId(/hotspot-10-5/);
    expect(hotspotContainer).toHaveAttribute('style', expect.stringContaining('--x-pos: 10'));
    expect(hotspotContainer).toHaveAttribute('style', expect.stringContaining('--y-pos: 5'));
    expect(hotspotContainer).toHaveAttribute('style', expect.stringContaining('--width: 200'));
    expect(hotspotContainer).toHaveAttribute('style', expect.stringContaining('--height: 50'));
  });
  describe('text type', () => {
    it('uses defult text styles', () => {
      render(<Hotspot x={10} y={5} content={<HotspotContent />} type="text" />);

      const textHotspot = screen.getByTestId(/hotspot-10-5/).firstChild;
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--background-color: rgba( 255, 255, 255, 1)')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining(`--border-color: ${ui03}`)
      );
      expect(textHotspot).toHaveAttribute('style', expect.stringContaining('--border-width: 0'));
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-font-weight: normal')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-text-decoration-line: none')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining(`--title-font-color: ${text01}`)
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-font-size: 14')
      );
    });

    it('uses custom text styles', () => {
      render(
        <Hotspot
          x={10}
          y={5}
          content={<HotspotContent />}
          type="text"
          bold
          italic
          underline
          fontColor="#006666"
          fontSize={16}
          backgroundColor="#00FF00"
          backgroundOpacity={50}
          borderColor="#006666"
          borderWidth={1}
        />
      );

      const textHotspot = screen.getByTestId(/hotspot-10-5/).firstChild;
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--background-color: rgba( 0, 255, 0, 0.5)')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--border-color: #006666')
      );
      expect(textHotspot).toHaveAttribute('style', expect.stringContaining('--border-width: 1'));
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-font-weight: bold')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-text-decoration-line: underline')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-font-color: #006666')
      );
      expect(textHotspot).toHaveAttribute(
        'style',
        expect.stringContaining('--title-font-size: 16')
      );
    });
    it('handles onClick callback', () => {
      const onClick = jest.fn();
      render(
        <Hotspot
          x={10}
          y={5}
          content={<HotspotContent title="test-title" />}
          type="text"
          onClick={onClick}
        />
      );

      fireEvent.click(screen.getByText('test-title'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
