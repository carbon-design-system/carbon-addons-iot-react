import { moduleMetadata } from '@storybook/angular';
import { ContextMenuModule } from 'carbon-components-angular/context-menu';
import { ButtonMenuModule } from './button-menu.module';

export default {
  title: 'Components/Button menu',

  decorators: [
    moduleMetadata({
      imports: [ButtonMenuModule, ContextMenuModule],
    })
  ],
};

export const basic = () => ({
  template: `
    <ai-button-menu label="Button">
      <ibm-context-menu-item label="Create"></ibm-context-menu-item>
              <ibm-context-menu-item label="Import"></ibm-context-menu-item>
      <ibm-context-menu-item label="Share"></ibm-context-menu-item>
              <ibm-context-menu-divider></ibm-context-menu-divider>
              <ibm-context-menu-item label="Delete"></ibm-context-menu-item>
    </ai-button-menu>
  `,
  name: 'Basic'
});

export const complex = () => ({
  template: `
    <ai-button-menu label="Button">
      <ibm-context-menu-item label="Cut" info="⌘X"></ibm-context-menu-item>
        <ibm-context-menu-item label="Option with icon" icon="calendar"></ibm-context-menu-item>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-item type="checkbox" label="Enable magic"></ibm-context-menu-item>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-group label="Selection group">
            <ibm-context-menu-item type="checkbox" label="Blue"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Red" [checked]="true"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Black"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Green"></ibm-context-menu-item>
        </ibm-context-menu-group>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-item label="Radio flyout">
            <ibm-context-menu>
                <ibm-context-menu-group type="radio">
                    <ibm-context-menu-item type="radio" label="Radio one" value="one"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio two" value="two"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio three" value="three"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio four" value="four"></ibm-context-menu-item>
                </ibm-context-menu-group>
            </ibm-context-menu>
        </ibm-context-menu-item>
        <ibm-context-menu-item label="Checkbox flyout">
            <ibm-context-menu>
                <ibm-context-menu-group type="checkbox">
                    <ibm-context-menu-item type="checkbox" label="Selectable item a" value="a"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item b" value="b"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item c" value="c"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item d" value="d"></ibm-context-menu-item>
                </ibm-context-menu-group>
            </ibm-context-menu>
        </ibm-context-menu-item>
    </ai-button-menu>
  `,
  name: 'Complex'
});

export const splitButton = () => ({
  template: `
    <ai-button-menu split="true" label="Button">
      <ibm-context-menu-item label="Cut" info="⌘X"></ibm-context-menu-item>
        <ibm-context-menu-item label="Option with icon" icon="calendar"></ibm-context-menu-item>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-item type="checkbox" label="Enable magic"></ibm-context-menu-item>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-group label="Selection group">
            <ibm-context-menu-item type="checkbox" label="Blue"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Red" [checked]="true"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Black"></ibm-context-menu-item>
            <ibm-context-menu-item type="checkbox" label="Green"></ibm-context-menu-item>
        </ibm-context-menu-group>
        <ibm-context-menu-divider></ibm-context-menu-divider>
        <ibm-context-menu-item label="Radio flyout">
            <ibm-context-menu>
                <ibm-context-menu-group type="radio">
                    <ibm-context-menu-item type="radio" label="Radio one" value="one"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio two" value="two"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio three" value="three"></ibm-context-menu-item>
                    <ibm-context-menu-item type="radio" label="Radio four" value="four"></ibm-context-menu-item>
                </ibm-context-menu-group>
            </ibm-context-menu>
        </ibm-context-menu-item>
        <ibm-context-menu-item label="Checkbox flyout">
            <ibm-context-menu>
                <ibm-context-menu-group type="checkbox">
                    <ibm-context-menu-item type="checkbox" label="Selectable item a" value="a"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item b" value="b"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item c" value="c"></ibm-context-menu-item>
                    <ibm-context-menu-item type="checkbox" label="Selectable item d" value="d"></ibm-context-menu-item>
                </ibm-context-menu-group>
            </ibm-context-menu>
        </ibm-context-menu-item>
    </ai-button-menu>
  `,
  name: 'Split Button'
});

export const iconOnly = () => ({
  template: `
    <ai-button-menu label="Button" iconOnly="true" openIcon="add" closeIcon="close">
      <ibm-context-menu-item label="Cut" info="⌘X"></ibm-context-menu-item>
              <ibm-context-menu-item label="Option with icon" icon="calendar"></ibm-context-menu-item>
              <ibm-context-menu-divider></ibm-context-menu-divider>
              <ibm-context-menu-item type="checkbox" label="Enable magic"></ibm-context-menu-item>
              <ibm-context-menu-divider></ibm-context-menu-divider>
              <ibm-context-menu-group label="Selection group">
                  <ibm-context-menu-item type="checkbox" label="Blue"></ibm-context-menu-item>
                  <ibm-context-menu-item type="checkbox" label="Red" [checked]="true"></ibm-context-menu-item>
                  <ibm-context-menu-item type="checkbox" label="Black"></ibm-context-menu-item>
                  <ibm-context-menu-item type="checkbox" label="Green"></ibm-context-menu-item>
              </ibm-context-menu-group>
              <ibm-context-menu-divider></ibm-context-menu-divider>
              <ibm-context-menu-item label="Radio flyout">
                  <ibm-context-menu>
                      <ibm-context-menu-group type="radio">
                          <ibm-context-menu-item type="radio" label="Radio one" value="one"></ibm-context-menu-item>
                          <ibm-context-menu-item type="radio" label="Radio two" value="two"></ibm-context-menu-item>
                          <ibm-context-menu-item type="radio" label="Radio three" value="three"></ibm-context-menu-item>
                          <ibm-context-menu-item type="radio" label="Radio four" value="four"></ibm-context-menu-item>
                      </ibm-context-menu-group>
                  </ibm-context-menu>
              </ibm-context-menu-item>
              <ibm-context-menu-item label="Checkbox flyout">
                  <ibm-context-menu>
                      <ibm-context-menu-group type="checkbox">
                          <ibm-context-menu-item type="checkbox" label="Selectable item a" value="a"></ibm-context-menu-item>
                          <ibm-context-menu-item type="checkbox" label="Selectable item b" value="b"></ibm-context-menu-item>
                          <ibm-context-menu-item type="checkbox" label="Selectable item c" value="c"></ibm-context-menu-item>
                          <ibm-context-menu-item type="checkbox" label="Selectable item d" value="d"></ibm-context-menu-item>
                      </ibm-context-menu-group>
                  </ibm-context-menu>
              </ibm-context-menu-item>
    </ai-button-menu>
  `,
  name: 'Icon only'
});
