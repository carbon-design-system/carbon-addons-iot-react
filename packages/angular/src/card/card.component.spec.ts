import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CardModule } from './card.module';

@Component({
  selector: 'app-card-test',
  template: `
    <ai-card [defaultHeight]="200">
      <ai-card-header>
        <ai-card-title text="Card Title"></ai-card-title>
      </ai-card-header>
      <ai-card-content>Demo Card content</ai-card-content>
    </ai-card>
  `,
})
class AppCardTest {}

describe('Card', () => {
  let fixture: ComponentFixture<AppCardTest>;
  let component: AppCardTest;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppCardTest],
      imports: [CardModule],
    });

    fixture = TestBed.createComponent(AppCardTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should work', () => {
    expect(component).toBeDefined();
  });

  it('should have an overall height of 200px', () => {
    const card: DebugElement = fixture.debugElement.query(By.css('ai-card'));
    const cardElement: HTMLElement = card.nativeElement;
    const height = cardElement.style.getPropertyValue('--card-default-height');
    expect(height).toBe('200px');
  });

  it('should have an content height of 152px', () => {
    const cardContent: DebugElement = fixture.debugElement.query(By.css('ai-card-content'));
    const cardContentElement: HTMLElement = cardContent.nativeElement;
    const height = cardContentElement.style.getPropertyValue('--card-content-height');
    expect(height).toBe('152px');
  });

  it('should have a title of `Card Title`', () => {
    const cardTitle: DebugElement = fixture.debugElement.query(By.css('ai-card-title *[title]'));
    const cardTitleElement: HTMLElement = cardTitle.nativeElement;
    expect(cardTitleElement.textContent.trim()).toBe('Card Title');
    expect(cardTitleElement.getAttribute('title')).toBe('Card Title');
  });

  it('should have some demo content', () => {
    const cardContent: DebugElement = fixture.debugElement.query(By.css('ai-card-content'));
    const cardContentElement: HTMLElement = cardContent.nativeElement;
    expect(cardContentElement.textContent.trim()).toBe('Demo Card content');
  });
});
