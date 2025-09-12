import { ICONS } from './icon.config';

export type IconName = keyof typeof ICONS;

export interface IconConfig {
  icon: string;
}

export type IconSize = 'sm' | 'md' | 'lg';

export type IconCollection = {
  [Key in IconName]: IconConfig;
};
