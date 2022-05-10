import { HTMLEnhancement, NodeEnhancement } from '@sap/guided-answers-extension-types';
import enhncmntConf from './enhancements.json';

export const enhancements: { nodeEnhancements: NodeEnhancement[]; htmlEnhancements: HTMLEnhancement[] } = enhncmntConf;
export { handleCommand } from './commandHandler';
