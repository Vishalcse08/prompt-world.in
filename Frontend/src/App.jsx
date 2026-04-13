import React from 'react';
import { UserProvider } from './UserContext';
import Routing from './Routing';

function App() {
  return (
    <UserProvider>
      <Routing />
    </UserProvider>
  );
}

export default App;
