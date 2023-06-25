import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import MainNavigator from './navigations/MainNavigator';

global.Buffer = require('buffer').Buffer;

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default App;
