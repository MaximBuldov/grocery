import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient()



ReactDOM.render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>,
  document.getElementById('root')
);

