import { IconName } from '../icon/icon.types';

export enum MenuState {
  Expanded,
  Collapsed,
  Hidden,
}

export interface MenuItem {
  id?: string;
  label: string;
  icon?: IconName;
  route?: string | any[];
  action?: () => void;
  children?: MenuItem[];
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export type ActionItem = Omit<MenuItem, 'children'>;
