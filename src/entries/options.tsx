import { render } from 'preact';
import { OptionsPage } from '../OptionsPage';

const rootEl = document.getElementById('app');

if (!rootEl) {
  throw new Error('Root element not found');
}

render(<OptionsPage />, rootEl);
