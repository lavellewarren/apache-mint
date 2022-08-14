import React from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { useMint, useMetaplexTokenMetadata } from "@strata-foundation/react";
import { toNumber } from "@strata-foundation/spl-token-bonding";
import { BigText, BlackBox } from "./LbcInfo";

export const CandyMachineInfo = ({ candyMachine, itemsRemaining, isWhitelistUser, discountPrice }) => {
  const { metadata, loading: loadingMeta } = useMetaplexTokenMetadata(
    candyMachine?.tokenMint
  );
  const ticker = loadingMeta ? "" : metadata?.data.symbol || "SOL";
  const targetMint = useMint(candyMachine?.tokenMint || NATIVE_MINT);

  return (
    <HStack spacing={2} justify="stretch">
      <BlackBox w="full">
        <VStack spacing={0} align="left">
          <Text fontSize="sm">
            {isWhitelistUser && discountPrice ? "Discount Price" : "Price"}
          </Text>
          <BigText>
            {isWhitelistUser && discountPrice
              ? `${
                  targetMint && discountPrice
                    ? toNumber(discountPrice, targetMint)
                    : ""
                } ${ticker}`
              : candyMachine
              ? `${
                  targetMint && candyMachine?.price
                    ? toNumber((discountPrice || candyMachine.price), targetMint)
                    : ""
                } ${ticker}`
              : ""}
          </BigText>
        </VStack>
      </BlackBox>
      <BlackBox w="full">
        <VStack spacing={0} align="left">
          <Text fontSize="sm">Remaining</Text>
          <BigText>{itemsRemaining}</BigText>
        </VStack>
      </BlackBox>
    </HStack>
  );
};