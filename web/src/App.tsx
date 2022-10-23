import React, { useState } from 'react';
import Game from './Game';
import Home from './Home';
import Redirect from './Redirect';

const App: React.FC = () => {
  const [path] = useState(window.location.pathname);
  const match = path.match(/^\/game\/([^/]+$)/);
  const gameId = match ? match[1] : null;
  if (gameId != null) {
    return <Game id={gameId} />;
  }
  if (path === '/') {
    return <Home />;
  }
  return <Redirect />;
};

export default App;
