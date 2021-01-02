import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, } from 'react-router-dom';

import upload from './upload';
import listen from './listen'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path='/' component={upload} exact />
        <Route component={listen} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('kei')
);