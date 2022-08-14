import {
  Button,
  Flex,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLivePrice } from "@strata-foundation/marketplace-ui";
import {
  Notification,
  useBondingPricing,
  useCapInfo,
  useErrorHandler,
  useProvider,
  useStrataSdks,
  useTokenBonding,
  useUserOwnedAmount,
} from "@strata-foundation/react";
import React from "react";
import { useAsyncCallback } from "react-async-hook";
import toast from "react-hot-toast";

async function buy({
  tokenBondingSdk,
  tokenBonding,
  maxPrice,
}) {
  if (tokenBondingSdk && tokenBonding) {
    if (isNaN(maxPrice)) {
      throw new Error("Invalid slippage");
    }
    await tokenBondingSdk.buy({
      tokenBonding,
      desiredTargetAmount: 1,
      expectedBaseAmount: maxPrice,
      slippage: 0,
    });
    toast.custom((t) => (
      <Notification
        show={t.visible}
        type="success"
        heading="Transaction Successful"
        message={`Succesfully minted! Check the collectibles section of your wallet for the token.`}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ));
  }
}

export const MintButton = ({
  tokenBondingKey,
  price: inputPrice,
  isDisabled,
  disabledText,
  onMint = buy,
}) => {
  const { connected, publicKey } = useWallet();
  const { awaitingApproval } = useProvider();
  const { numRemaining } = useCapInfo(tokenBondingKey);
  const {
    loading: pricingLoading,
    error: pricingError,
  } = useBondingPricing(tokenBondingKey);
  const { handleErrors } = useErrorHandler();
  const { tokenBondingSdk } = useStrataSdks();
  const { execute, loading, error } = useAsyncCallback(onMint);
  handleErrors(pricingError, error);
  const { info: tokenBonding, loading: bondingLoading } =
    useTokenBonding(tokenBondingKey);
  const { price } = useLivePrice(tokenBonding?.publicKey);
  const priceToUse = inputPrice || price;
  const targetBalance = useUserOwnedAmount(publicKey, tokenBonding?.targetMint);

  const ownedAmount = useUserOwnedAmount(publicKey, tokenBonding?.baseMint);
  const insufficientBalance = (priceToUse || 0) > (ownedAmount || 0);
  const notLive =
    tokenBonding &&
    tokenBonding.goLiveUnixTime.toNumber() > new Date().valueOf() / 1000;

  const canFinishPrevious = (targetBalance || 0) > 0;
  return (
    <Flex>
      <Button
        w={'full'}
        background={'#9a46fb'}
        color={'white'}
        fontSize={'2xl'}
        fontWeight={'bold'}
        size={'lg'}
        onClick={() =>
          execute({
            tokenBondingSdk,
            tokenBonding: tokenBondingKey,
            maxPrice: priceToUse * (1 + 5 / 100),
          })
        }
        isLoading={bondingLoading || pricingLoading || loading}
        colorScheme="primary"
        isDisabled={
          (numRemaining === 0 && !targetBalance) ||
          ((targetBalance || 0) === 0 && insufficientBalance) ||
          notLive ||
          (!canFinishPrevious && isDisabled)
        }
        loadingText={
          awaitingApproval
            ? "Awaiting Approval"
            : loading
            ? "Submitting"
            : "Loading"
        }
      >
        {canFinishPrevious
          ? "Finish previous Mint Transaction"
          : numRemaining === 0
          ? "Sold Out"
          : insufficientBalance
          ? "Insufficient Balance"
          : notLive
          ? `Goes live at ${
              tokenBonding &&
              new Date(
                tokenBonding.goLiveUnixTime.toNumber() * 1000
              ).toLocaleString()
            }`
          : connected
          ? "MINT"
          : "CONNECT WALLET"}
      </Button>
    </Flex>
  );
};
