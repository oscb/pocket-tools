import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// CSS
import './index.scss';
// import 'font-awesome/css/font-awesome.min.css';

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(
  <App />,
  root
);
registerServiceWorker();
