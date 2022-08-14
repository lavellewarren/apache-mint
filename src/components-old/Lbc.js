import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useLivePrice } from "@strata-foundation/marketplace-ui";
import { MemodSwap, useTokenSwapFromId } from "@strata-foundation/react";
import React from "react";
import { BondingPlot } from "./BondingPlot";
import { LbcInfo } from "./LbcInfo";
import { LbcStatus } from "./LbcStatus";
import { TransactionHistory } from "./TransactionHistory";

const selectedProps = {
  borderBottom: "3px solid #F07733",
  fontWeight: "semibold",
};

export function Lbc({
  id,
  onConnectWallet,
  onSuccess,
}) {
  const { tokenBonding } = useTokenSwapFromId(id);

  const { price } = useLivePrice(tokenBonding?.publicKey);

  const bg = useColorModeValue("white", "black.300");

  return (
    <Tabs variant="unstyled" isLazy>
      <TabList borderBottom="none">
        <Tab _selected={selectedProps} fontWeight={"normal"}>
          Swap
        </Tab>
        <Tab _selected={selectedProps} fontWeight={"normal"}>
          Transactions
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0} pt={4}>
          <LbcStatus tokenBondingKey={tokenBonding?.publicKey} />
          <Box
            zIndex={1}
            shadow="xl"
            rounded="lg"
            p="16px"
            minH="300px"
            bg={bg}
          >
            {typeof window !== "undefined" && (
              <VStack align="stretch" spacing={8}>
                <LbcInfo price={price} id={id} useTokenOfferingCurve />
                <MemodSwap
                  onSuccess={onSuccess}
                  onConnectWallet={onConnectWallet}
                  id={id}
                />
              </VStack>
            )}
          </Box>
        </TabPanel>
        <TabPanel p={0} pt={4}>
          <Box
            zIndex={1}
            shadow="xl"
            rounded="lg"
            p="16px"
            pb="29px"
            minH="300px"
            bg={bg}
          >
            {typeof window != "undefined" && (
              <VStack align="stretch" spacing={8}>
                <BondingPlot tokenBondingKey={tokenBonding?.publicKey} />
                <TransactionHistory tokenBondingKey={tokenBonding?.publicKey} />
              </VStack>
            )}
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
