import logo from './assets/logo.svg';
import Header from './components/Header';
import Page from './components/Page';
import './App.css';
import React from 'react';

function App() {
  return (
    <div className="layout">
      <Header />
      <Page />
    </div>
  );
}

export default App;
