import { ui, type UIKey } from './ui';

export function t(key: UIKey, _locale: string = 'nl'): string {
  return ui.nl[key] ?? key;
}

export function getCollectionBasePath(
  collection: string,
  _locale: string = 'nl',
): string {
  return `/${collection}`;
}
