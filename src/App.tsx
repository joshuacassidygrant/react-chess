import * as dotenv from "dotenv"
import {useEffect, useState} from "react";
import "./App.css";
import {Game} from "./components/game";
import { GameContextProvider } from './components/game-context';
import {requestConnect} from "./utils/requests";

dotenv.config();

function App() {

  useEffect(() => {
    requestConnect().then(res => {
      setServerStatus(res);
    })
  }, []);
  const [serverStatus, setServerStatus] = useState<any>(null);


  return (
    <div className="App">
      <header className="App-header">
        REACT CHESS by JOSHUA<br/>
        {
          !serverStatus && <small>Connecting to server...</small>
        }
      </header>
      {
        !!serverStatus && 
        (<div className="Main">
          <GameContextProvider>
            <Game/>
          </GameContextProvider>
        </div>)
      }

    </div>
  );
}

export default App;
