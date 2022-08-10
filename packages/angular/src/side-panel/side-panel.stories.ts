import { moduleMetadata } from '@storybook/angular';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  PlaceholderModule,
} from 'carbon-components-angular';
import { SidePanelModule } from './side-panel.module';

export default {
  title: 'Components/Side panel',

  decorators: [
    moduleMetadata({
      imports: [ButtonModule, DialogModule, PlaceholderModule, SidePanelModule, IconModule],
    })
  ],
  argTypes: {
    showClose: { control: 'boolean', defaultValue: true },
    showDrawer: { control: 'boolean', defaultValue: false },
    active: { control: 'boolean', defaultValue: false },
    overlay: { control: 'boolean', defaultValue: false },
    titleCondensed: { control: 'boolean', defaultValue: false },
    variation: {
      control: {
        type: 'select',
        options: ['slide-in', 'inline', 'slide-over']
      },
      defaultValue: 'inline'
    },
    side: {
      control: {
        type: 'select',
        options: ['left', 'right']
      },
      defaultValue: 'left'
    },
    close: {
      action: 'close',
      table: {
        disable: true
      }
    }
  }
};

export const basic = (args) => ({
  template: `
    <div style="display: flex;">
      <ai-side-panel
        *ngIf="side === 'left'"
        [showClose]="showClose"
        [showDrawer]="showDrawer"
        [active]="active"
        [overlay]="overlay"
        [variation]="variation"
        [side]="side"
        (close)="active = !active; close.emit()"
      >
        <div aiSidePanelTitle [condensed]="titleCondensed">Filter</div>
        <div style="margin-left: 1rem; margin-right: 1rem; min-height: 330px; height: 100%;">Content</div>
        <div aiSidePanelFooter>
          <button ibmButton="secondary" size="lg">Cancel</button>
          <button ibmButton size="lg">Initiate</button>
        </div>
      </ai-side-panel>
      <div style="display: inline-block; position: relative; margin-left: 1rem; margin-right: 1rem">
        <h2>Content</h2>
        <button
          ibmButton
          *ngIf="variation === 'slide-in' || variation === 'slide-over'"
          (click)="active = !active"
        >
          {{ active ? 'Deactivate' : 'Activate' }}
        </button>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a dapibus nulla. Fusce et
          enim et elit rutrum interdum quis eu nulla. Nulla neque neque, condimentum eget
          pellentesque sit amet, volutpat ac enim. Etiam id magna vel dolor condimentum imperdiet.
          Vivamus eu pellentesque turpis, eget ultricies lectus. Vestibulum sodales massa non
          lobortis interdum. Sed cursus sem in dolor tempus tempus. Pellentesque et nisi vel erat
          egestas ultricies.
        </p>
        <p>
          Etiam id risus nec mi laoreet suscipit. Phasellus porttitor accumsan placerat. Donec
          auctor nunc id erat congue, tincidunt viverra diam feugiat. Donec sit amet quam vel augue
          auctor posuere. Nunc maximus volutpat nulla vel vehicula. Praesent bibendum nulla at erat
          facilisis sodales. Aenean aliquet dui vel iaculis tincidunt. Praesent suscipit ultrices mi
          eget finibus. Mauris vehicula ultricies auctor. Nam vestibulum iaculis lectus, nec sodales
          metus lobortis non.
        </p>
        <p>
          Suspendisse nulla est, consectetur non convallis et, tristique eu risus. Sed ut tortor et
          nulla tempor vulputate et vel ligula. Curabitur egestas lorem ut mi vestibulum porttitor.
          Fusce eleifend vehicula semper. Donec luctus neque quam, et blandit eros accumsan at.
        </p>
      </div>
      <ai-side-panel
        *ngIf="side === 'right'"
        [showClose]="showClose"
        [showDrawer]="showDrawer"
        [active]="active"
        [overlay]="overlay"
        [variation]="variation"
        [side]="side"
        (close)="active = !active; close.emit()"
      >
        <div aiSidePanelTitle [condensed]="titleCondensed">Filter</div>
        <div style="margin-left: 1rem; margin-right: 1rem; min-height: 330px; height: 100%;">Content</div>
        <div aiSidePanelFooter>
          <button ibmButton="secondary" size="lg">Cancel</button>
          <button ibmButton size="lg">Initiate</button>
        </div>
      </ai-side-panel>
    </div>
  `,
  props: args
});
