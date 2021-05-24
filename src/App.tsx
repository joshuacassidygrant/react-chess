import * as dotenv from "dotenv"
import "./App.css";
import {Game} from "./components/game";
import { GameContextProvider } from './components/game-context';

dotenv.config();

function App() {

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
