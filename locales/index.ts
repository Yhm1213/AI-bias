import { zh } from './zh';
import { en } from './en';

export type Language = 'CN' | 'EN';
export type LocaleDictionary = typeof zh;

export const locales: Record<Language, LocaleDictionary> = {
  CN: zh,
  EN: en,
};
