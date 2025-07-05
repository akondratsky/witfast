import { render } from 'preact';
import { Main } from './modules/Main';

const rootEl = document.getElementById('app');

if (!rootEl) {
  throw new Error('Root element not found');
}

render(<Main />, rootEl);
