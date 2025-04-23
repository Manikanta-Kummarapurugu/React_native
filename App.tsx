import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import your custom components
import Texts from './src/text';
import LeftMenu from './src/LeftMenu';
import Buttons from './src/buttons';
import dropDown from './src/dropDown';
import cameraScreen from './src/cameraScreen';
import permissions from './src/services/permissions';
import ScanQRPage from './src/Scanner';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import countdownCircleTimer from './src/services/Countdown';

// Create the Drawer Navigator
const Drawer = createDrawerNavigator();

const AppDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <LeftMenu {...props} />}
    initialRouteName="texts"
  >
    <Drawer.Screen name="texts" component={Texts}
      options={{
        title: 'React Native', 
      }}
    />
    <Drawer.Screen name="buttons" component={Buttons}
      options={{
        title: 'React Native', 
      }}
    />
    <Drawer.Screen name="dropdowns" component={dropDown}
      options={{
        title: 'React Native', 
      }}
    />
    <Drawer.Screen name="camerascreen" component={cameraScreen}
      options={{
        title: 'React Native', 
      }}
    />
    <Drawer.Screen name="permissionspage" component={permissions}
      options={{
        title: 'React Native', 
      }}
    />
    <Drawer.Screen name="scanner" component={ScanQRPage}
      options={{
        title: 'React Native', 
      }}
    />
     <Drawer.Screen name="countdown" component={countdownCircleTimer}
      options={{
        title: 'React Native', 
      }}
    />
  </Drawer.Navigator>
);

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <AppDrawer />
    </NavigationContainer>
  );
};

export default App;
