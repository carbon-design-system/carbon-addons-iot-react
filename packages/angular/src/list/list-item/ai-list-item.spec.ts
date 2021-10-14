import { AIListItem } from './ai-list-item.class';

const checkIds = (items: AIListItem[]) =>
  items.every((item) => {
    if (item.hasChildren()) {
      checkIds(item.items);
    }
    return item.id;
  });

describe('List item model', () => {
  it('should initialize an AIListItem', () => {
    const initWithObject = new AIListItem({});
    const initWithNothing = new AIListItem();

    expect(initWithObject).toEqual(jasmine.any(AIListItem));
    expect(initWithNothing).toEqual(jasmine.any(AIListItem));
  });

  it('should set ids on every AIListItem', () => {
    const items = [new AIListItem({}), new AIListItem({}), new AIListItem({})];
    expect(items.every((item) => item.id)).toBe(true);
  });

  it('should return `true` if list item has children and `false` if not', () => {
    const itemWithChildren = new AIListItem({
      items: [new AIListItem({}), new AIListItem({})],
    });

    const itemWithoutChildren = new AIListItem({
      items: [],
    });

    const itemWithoutInitializedChildren = new AIListItem({});

    expect(itemWithChildren.hasChildren()).toBe(true);
    expect(itemWithoutChildren.hasChildren()).toBe(false);
    expect(itemWithoutInitializedChildren.hasChildren()).toBe(false);
  });

  it('should set `id`s on all list item children', () => {
    const items = [
      new AIListItem({
        items: [new AIListItem({}), new AIListItem({})],
      }),
      new AIListItem({
        items: [
          new AIListItem({
            items: [new AIListItem(), new AIListItem(), new AIListItem(), new AIListItem({})],
          }),
          new AIListItem({}),
        ],
      }),
    ];

    expect(checkIds(items)).toBe(true);
  });

  it('should not override given `id`', () => {
    const item = new AIListItem({ id: 'test' });
    const nestedItem = new AIListItem({
      items: [
        new AIListItem({
          items: [new AIListItem({ id: 'test' })],
        }),
      ],
    });

    expect(item.id === 'test');
    expect(nestedItem.items[0].items[0].id === 'test');
    expect(checkIds([nestedItem])).toBe(true);
  });

  it('should set `expanded` to `true` and `false`', () => {
    const item = new AIListItem({});

    item.expand();
    expect(item.expanded).toBe(true);
    item.expand(false);
    expect(item.expanded).toBe(false);
    item.expand(true);
    expect(item.expanded).toBe(true);
  });

  it('should set `selected` to `true` and `false`', () => {
    const item = new AIListItem({});

    item.select();
    expect(item.selected).toBe(true);
    item.select(false);
    expect(item.selected).toBe(false);
    item.select(true);
    expect(item.selected).toBe(true);
  });

  it('should set `indeterminate` to `true` and `false`', () => {
    const item = new AIListItem({});

    item.setIndeterminate();
    expect(item.indeterminate).toBe(true);
    item.setIndeterminate(false);
    expect(item.indeterminate).toBe(false);
    item.setIndeterminate(true);
    expect(item.indeterminate).toBe(true);
  });

  it('should set `disabled` to `true` and `false`', () => {
    const item = new AIListItem({});

    item.disable();
    expect(item.disabled).toBe(true);
    item.disable(false);
    expect(item.disabled).toBe(false);
    item.disable(true);
    expect(item.disabled).toBe(true);
  });

  it('should set add a list item to the given index', () => {
    const item = new AIListItem({
      items: [new AIListItem({})],
    });
    item.addItem(new AIListItem({ id: 'index 0' }));
    item.addItem(new AIListItem({ id: 'index 2' }), 2);

    expect(item.items[0].id).toBe('index 0');
    expect(item.items[2].id).toBe('index 2');
  });

  it('should add a list item to the last index if given index is out of bounds', () => {
    const item = new AIListItem({
      items: [new AIListItem({})],
    });
    item.addItem(new AIListItem({ id: 'index 1' }), 5);

    expect(item.items[1].id).toBe('index 1');
  });

  it('should remove the list item at the given index', () => {
    const item = new AIListItem({
      items: [new AIListItem({}), new AIListItem({})],
    });
    item.removeItem(1);

    expect(item.items.length).toBe(1);
  });

  it('should remove the list item at the given index', () => {
    const item = new AIListItem({
      items: [new AIListItem({}), new AIListItem({})],
    });
    item.removeItem(1);

    expect(item.items.length).toBe(1);
  });

  it('should return `true` if the list item has a given item as a child and `false` if not', () => {
    const item = new AIListItem();

    const nestedItems = new AIListItem({
      items: [new AIListItem(), new AIListItem(), new AIListItem(), item, new AIListItem()],
    });

    expect(nestedItems.hasItem(item)).toBe(true);
    expect(nestedItems.hasItem(new AIListItem())).toBe(false);
  });

  it('should return `true` if some children are selected and selectable and `false` if not', () => {
    const itemWithOneSelectedChild = new AIListItem({
      items: [
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem(),
        new AIListItem(),
        new AIListItem(),
      ],
    });

    const itemWithAllChildrenSelected = new AIListItem({
      items: [
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
      ],
    });

    const itemWithNoSelectedChildren = new AIListItem({
      items: [new AIListItem(), new AIListItem(), new AIListItem(), new AIListItem()],
    });

    const itemWithAllChildrenSelectedAndNotSelectable = new AIListItem({
      items: [
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
      ],
    });

    expect(itemWithOneSelectedChild.someChildrenSelected()).toBe(true);
    expect(itemWithAllChildrenSelected.someChildrenSelected()).toBe(true);
    expect(itemWithNoSelectedChildren.someChildrenSelected()).toBe(false);
    expect(itemWithAllChildrenSelectedAndNotSelectable.someChildrenSelected()).toBe(false);
  });

  it('should return `true` if all children are selected and selectable and `false` if not', () => {
    const itemWithOneSelectedChild = new AIListItem({
      items: [
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem(),
        new AIListItem(),
        new AIListItem(),
      ],
    });

    const itemWithAllChildrenSelected = new AIListItem({
      items: [
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
        new AIListItem({ isSelectable: true, selected: true }),
      ],
    });

    const itemWithNoSelectedChildren = new AIListItem({
      items: [new AIListItem(), new AIListItem(), new AIListItem(), new AIListItem()],
    });

    const itemWithAllChildrenSelectedAndNotSelectable = new AIListItem({
      items: [
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
        new AIListItem({ selected: true }),
      ],
    });

    expect(itemWithOneSelectedChild.allChildrenSelected()).toBe(false);
    expect(itemWithAllChildrenSelected.allChildrenSelected()).toBe(true);
    expect(itemWithNoSelectedChildren.allChildrenSelected()).toBe(false);
    expect(itemWithAllChildrenSelectedAndNotSelectable.allChildrenSelected()).toBe(false);
  });

  it('Should return `true` if `value` or `secondaryValue` contains given string as a substring', () => {
    const items = [
      new AIListItem({ value: 'CHAR', id: 'item 1' }),
      new AIListItem({ value: 'CHARIZARD', id: 'item 2' }),
      new AIListItem({ value: 'charizard', secondaryValue: 'pokemon', id: 'item 3' }),
    ];

    expect(items.filter((item) => item.includes('char')).map((item) => item.id)).toEqual([
      'item 1',
      'item 2',
      'item 3',
    ]);
    expect(items.filter((item) => item.includes('charizard')).map((item) => item.id)).toEqual([
      'item 2',
      'item 3',
    ]);
    expect(items.filter((item) => item.includes('pokemon')).map((item) => item.id)).toEqual([
      'item 3',
    ]);
  });

  it('Should return `true` if `value` or `secondaryValue` of a child contains given string as a substring', () => {
    const items = [
      new AIListItem({
        value: 'CHAR',
        id: 'item 1',
      }),
      new AIListItem({ value: 'CHARIZARD', id: 'item 2' }),
      new AIListItem({ value: 'charizard', secondaryValue: 'pokemon', id: 'item 3' }),
    ];

    expect(items.filter((item) => item.includes('char')).map((item) => item.id)).toEqual([
      'item 1',
      'item 2',
      'item 3',
    ]);
    expect(items.filter((item) => item.includes('charizard')).map((item) => item.id)).toEqual([
      'item 2',
      'item 3',
    ]);
    expect(items.filter((item) => item.includes('pokemon')).map((item) => item.id)).toEqual([
      'item 3',
    ]);
  });
});
