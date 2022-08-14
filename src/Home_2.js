import { Container } from '@chakra-ui/react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { BrowserView, MobileView } from "react-device-detect";
import { Toaster } from 'react-hot-toast';
import { DynamicPricingCandyMachine } from './components-old/DynamicPricingCandyMachine';

function Home() {
  const { setVisible } = useWalletModal();
  return (
    <div style={{ height: "100vh" }}>
        <Container pt={12}>
          <DynamicPricingCandyMachine
            onConnectWallet={() => setVisible(true)}
            candyMachineId={process.env.REACT_APP_CANDYMACHINE_ID}
          />
        </Container>
        <BrowserView>
          <Toaster
            position="bottom-left"
            containerStyle={{
              width: "420px",
            }}
          />
        </BrowserView>
        <MobileView>
          <Toaster
            position="bottom-center"
            containerStyle={{
              margin: "0 auto",
              width: "90%",
              maxWidth: "420px",
            }}
          />
        </MobileView>
    </div>
  );
};

export default Home;
