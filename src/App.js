import Home from './Home';
// import Home from './Home2';
import { Providers } from './components/Providers';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Maintenance from './Maintenance';

const isMaintenance = process.env.REACT_APP_MAINTENANCE_MODE === 'true' ? true : false;

function App() {
  return (
    <Providers>
      <ChakraProvider theme={theme}>
        {!isMaintenance && <Home/>}
        {isMaintenance && <Maintenance/>}
      </ChakraProvider>
    </Providers>
  );
}

export default App;
