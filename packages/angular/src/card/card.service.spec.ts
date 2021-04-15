import { CardService } from './card.service';

describe('CardService', () => {
  let service: CardService;

  beforeEach(() => {
    service = new CardService();
  });

  it('should return a formatted height string for a given card height', () => {
    service.setCardHeight(400);
    expect(service.getCardHeight()).toBe('400px');
    service.setCardHeight(200);
    expect(service.getCardHeight()).toBe('200px');
  });

  it('should return a formatted height string for the content of a card', () => {
    service.setCardHeight(400);
    expect(service.getContentHeight()).toBe('352px');
    service.setCardHeight(200);
    expect(service.getContentHeight()).toBe('152px');
  });

  it('should broadcast the expanded state', (done) => {
    // skip the first value.
    // It's a behaviour subject so the first value is the initial value (false in this case)
    let isInitialValue = true;
    service.onExpand((value) => {
      if (!isInitialValue) {
        expect(value).toBeTruthy();
        done();
      }
      isInitialValue = false;
    });
    service.setExpanded(true);
  });
});
