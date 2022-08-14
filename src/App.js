import Home from './Home';
// import Home from './Home2';
import { Providers } from './components/Providers';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';;

function App() {
  return (
    <Providers>
      <ChakraProvider theme={theme}>
        <Home/>
      </ChakraProvider>
    </Providers>
  );
}

export default App;
