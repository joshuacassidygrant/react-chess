import React from 'react';
import reportWebVitals from "./reportWebVitals";
import "./App.css";
import {Game} from "./components/game";
import { GameContextProvider } from './components/game-context';

function App() {
  // temp
  reportWebVitals(console.log)

  return (
    <div className="App">
      <header className="App-header">
        REACT CHESS by JOSHUA
      </header>
      <div className="Main">
        <GameContextProvider>
          <Game/>
        </GameContextProvider>
      </div>
    </div>
  );
}

export default App;
