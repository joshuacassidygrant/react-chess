import React from 'react';
import reportWebVitals from "./reportWebVitals";
import "./App.css";
import {Board} from "./components/board";

function App() {
  // temp
  reportWebVitals(console.log)

  return (
    <div className="App">
      <header className="App-header">
        REACT CHESS by JOSHUA
      </header>
      <div className="Main">
        <Board boardHeight={600} boardWidth={600} xWidthCells={8} yHeightCells={8}/>
      </div>
    </div>
  );
}

export default App;
