export class ListItem {
  value: string;

  items: ListItem[];

  nestingLevel: number;

  constructor(rawData?: any) {
    const defaults = {
      value: '',
      nestingLevel: 0,
      items: []
    };

    const data = Object.assign({}, defaults, rawData);
    for (const property of Object.getOwnPropertyNames(data)) {
      if (data.hasOwnProperty(property)) {
        this[property] = data[property];
      }
    }
  }
}
