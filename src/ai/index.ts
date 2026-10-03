/**
 * Registry for Genkit AI flows and tools.
 * Using relative imports without .js extensions for standard TS resolution.
 */
import './genkit';
import './flows/ouneo-flow';
import './tools/search-websites';

export { askOuneo } from './flows/ouneo-flow';
