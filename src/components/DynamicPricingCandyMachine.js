import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Progress,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintOneToken, numberWithCommas, useCandyMachineInfo, useLivePrice } from "@strata-foundation/marketplace-ui";
import {
  Notification,
  useSolanaUnixTime,
  useTokenBondingFromMint,
} from "@strata-foundation/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatUTC } from "../utils";
import { MintButton } from "./MintButton";
import { MintedNftNotification } from "./MintedNftNotification";
import { PrivatePrice } from "./PrivatePrice";
import { PublicPrice } from "./PublicPrice";
import { TimeCountdown } from "./TimeCountdown";

export const DynamicPricingCandyMachine = (
  props
) => {
  const { publicKey, connected } = useWallet();

  const cmState = useCandyMachineInfo(props.candyMachineId);
  const { candyMachine, isWhitelistUser, discountPrice, isActive, isPresale } = cmState;

  const mintKey = candyMachine?.tokenMint;
  const {
    info: tokenBonding,
  } = useTokenBondingFromMint(mintKey);
  const { price, loading: loadingPricing } = useLivePrice(tokenBonding?.publicKey);

  const onMint = async (args) => {
    try {
      if (
        connected &&
        candyMachine?.program &&
        publicKey &&
        props.candyMachineId
      ) {
        const mint = await mintOneToken(candyMachine, publicKey, args);
        if (props.onSuccess) {
          props.onSuccess(mint)
        } else {
          toast.custom(
            (t) => (
              <MintedNftNotification
                mint={mint}
                onDismiss={() => toast.dismiss(t.id)}
              />
            ),
            {
              duration: Infinity,
            }
          );  
        }
      }
    } catch (error) {
      let message =
        error.msg || error.toString() || "Minting failed! Please try again!";
      let heading = "Transaction Failed";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction Timeout! Please try again.";
        } else if (error.message.indexOf("0x137") !== -1) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135") !== -1) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        } else if (error.code === 6005 || error.code === 6006) {
          heading = "Transaction Cancelled";
          message =
            "The price moved unfavorably by more than the configured slippage. Change slippage by clicking Advanced Settings";
        } else {
          message = error.toString();
        }
      }

      console.error(error);

      toast.custom(
        (t) => (
          <Notification
            show={t.visible}
            type="error"
            heading={heading}
            message={message}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: 120 * 1000,
        }
      );
    }
  };

  useEffect(() => {
    console.log(candyMachine, candyMachine?.goLiveDate.toNumber(), 'candyMachine');
  }, [candyMachine]);

	const solanaUnixTime = useSolanaUnixTime();

	const [unixTime, setUnixTime] = useState(Math.round(Date.now() / 1000));

	useEffect(() => {
		setUnixTime(solanaUnixTime || Math.round(Date.now() / 1000));
	}, [solanaUnixTime]);

  return (
    <Grid
      w={'full'}
      h={'full'}
      minH={'100vh'}
      backgroundImage={
        'url(/assets/img/background.png)'
      }
      backgroundSize={'100% 100%'}
      backgroundPosition={'center center'}
      py={{ base: 8, md: 16 }}
      px={{ base: 12, md: 24 }}
      color={'black'}
    >
      <Grid w={'full'} marginBottom={{ base: 8, md: 16 }}>
        <Image
          alt={'Logo Image'}
          fit={'cover'}
          align={'center'}
          w={'120px'}
          h={'120px'}
          src={
            '/assets/img/logo1.png'
          }
        />
      </Grid>
      <Grid w={'full'} display={{ base: 'block', md: 'flex' }} marginBottom={'60'}>
        <GridItem
          w={{ base: '100%', md: '40%' }}
          marginTop={6}
        >
          <Text fontSize={'5xl'} fontWeight={'bold'} align={'center'}>
            MINT AN APACHE!
          </Text>
          <Text fontSize={'xl'} fontWeight={'bold'}>
            Description for the mint. Description for the mint. Description for the mint. Description for the mint. Description for the mint. 
          </Text>
          <Box
            position={'relative'}
            rounded={'2xl'}
            width={'full'}
            overflow={'hidden'}>
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={
                '/assets/img/apaches-gif.gif'
              }
            />
          </Box>
        </GridItem>
        <GridItem w={{ base: '100%', md: '60%' }} paddingLeft={{ base: 0, md: 12 }}>
          <Text fontSize={'2xl'} fontWeight={'bold'} marginBottom={6}>
            {!connected && `Please connect your wallet`}
            {
              candyMachine?.goLiveDate
              && unixTime < candyMachine?.goLiveDate.toNumber()
              && `Mint day: ${formatUTC(candyMachine?.goLiveDate.toNumber())}`
            }
            {
              candyMachine?.goLiveDate
              && unixTime > candyMachine?.goLiveDate.toNumber()
              && candyMachine?.isSoldOut === false
              && `Minting Now!`
            }
            {
              candyMachine?.goLiveDate
              && unixTime > candyMachine?.goLiveDate.toNumber()
              && candyMachine?.isSoldOut === true
              && `Sold Out!`
            }
          </Text>
          <Box
            rounded={'2xl'}
            background={'whiteAlpha.500'}
            px={8}
            paddingTop={6}
            paddingBottom={20}
          >
            {candyMachine?.goLiveDate && unixTime < candyMachine?.goLiveDate.toNumber() && (
              <TimeCountdown
                connected={connected}
                goLiveDate={candyMachine?.goLiveDate.toNumber()}
              />
            )}
            {candyMachine && candyMachine?.goLiveDate && unixTime > candyMachine?.goLiveDate.toNumber() && (
              <VStack marginBottom={6}>
                <Flex
                  width={'full'}
                  flexDirection={'row'}
                >
                  <Text fontSize={'2xl'} fontWeight={'bold'}>
                    Total Minted
                  </Text>
                  <Grid flexGrow={1}></Grid>
                  <Text fontSize={'2xl'} fontWeight={'bold'} color={'#568c74'} marginRight={'10px'}>
                    {!isNaN(Number(candyMachine.itemsAvailable)) && Number(candyMachine.itemsAvailable) !== 0 && (
                      `[${numberWithCommas(Number(candyMachine?.itemsRedeemed) / Number(candyMachine.itemsAvailable) * 100, 1)}%]`
                    )}
                  </Text>
                  <Text fontSize={'2xl'} fontWeight={'bold'}>
                    {`${candyMachine?.itemsRedeemed} / ${candyMachine.itemsAvailable}`}
                  </Text>
                </Flex>
                {!isNaN(Number(candyMachine.itemsAvailable)) && Number(candyMachine.itemsAvailable) !== 0 && (
                  <Progress
                    height='32px'
                    width={'full'}
                    value={Number(candyMachine?.itemsRedeemed) / Number(candyMachine.itemsAvailable) * 100}
                    borderRadius={'20px'}
                  />
                )}
              </VStack>
            )}
            <PrivatePrice
              connected={connected}
              candyMachine={candyMachine}
              isWhitelistUser={isWhitelistUser}
              discountPrice={discountPrice}
              goLiveDate={candyMachine?.goLiveDate.toNumber()}
            />
            <PublicPrice
              connected={connected}
              candyMachine={candyMachine}
              price={price}
              loadingPricing={loadingPricing}
              goLiveDate={candyMachine?.goLiveDate.toNumber()}
            />
            {connected && !candyMachine && (
              <Flex>
                <Button
                  w={'full'}
                  background={'#9a46fb'}
                  color={'white'}
                  fontSize={'2xl'}
                  fontWeight={'bold'}
                  size={'lg'}
                >
                  <Spinner />
                </Button>
              </Flex>
            )}
            {connected && candyMachine && (
              <MintButton
                price={price}
                onMint={onMint}
                tokenBondingKey={tokenBonding?.publicKey}
                isDisabled={
                  (!isActive && (!isPresale || !isWhitelistUser)) ||
                  (candyMachine.isWhitelistOnly && !isWhitelistUser)
                }
              />
            )}
            {!connected && (
              <Flex>
                <Button
                  w={'full'}
                  background={'#9a46fb'}
                  color={'white'}
                  fontSize={'2xl'}
                  fontWeight={'bold'}
                  size={'lg'}
                  onClick={props.onConnectWallet}
                >
                  Connect Wallet
                </Button>
              </Flex>
            )}
          </Box>
          <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} color={'#544a5c'}>
            Powered by LIBROS.COM
          </Text>
        </GridItem>
      </Grid>
    </Grid>
  );
};
