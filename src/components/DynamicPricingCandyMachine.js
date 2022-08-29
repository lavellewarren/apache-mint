import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Link,
  Progress,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintOneToken, numberWithCommas, useCandyMachine, useCandyMachineInfo, useLivePrice } from "@strata-foundation/marketplace-ui";
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
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const defaultGoLiveDate = Number(process.env.REACT_APP_DEFAULT_GOLIVEDATE ? process.env.REACT_APP_DEFAULT_GOLIVEDATE : 1660575600);
const presaleStartDate = Number(process.env.REACT_APP_PRESALE_STARTDATE ? process.env.REACT_APP_PRESALE_STARTDATE : 1660575600);
const presaleEndDate = presaleStartDate + Number(process.env.REACT_APP_PRESALE_DURATION ? process.env.REACT_APP_PRESALE_DURATION : 3600);

export const DynamicPricingCandyMachine = (
  props
) => {
  const { publicKey, connected } = useWallet();

  const { info: cndyInfo } = useCandyMachine(props.candyMachineId);

  const cmState = useCandyMachineInfo(props.candyMachineId);
  const { candyMachine, isWhitelistUser, discountPrice, isActive, isPresale } = cmState;
  const goLiveDate = candyMachine?.goLiveDate !== undefined && candyMachine?.goLiveDate.toNumber() !== 0 ? candyMachine?.goLiveDate.toNumber() : defaultGoLiveDate;

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

	const solanaUnixTime = useSolanaUnixTime();

	const [unixTime, setUnixTime] = useState(Math.round(Date.now() / 1000));

	useEffect(() => {
		setUnixTime(solanaUnixTime || Math.round(Date.now() / 1000));
	}, [solanaUnixTime]);

  return (
    <VStack justifyContent={'space-between'} background={'#544a5d'}>
      <Grid
        w={'full'}
        h={'full'}
        minH={'100vh'}
        backgroundImage={
          'url(/assets/img/background.png)'
        }
        backgroundSize={'100% 100%'}
        backgroundPosition={'center center'}
        py={{ base: 6, sm: 8, lg: 16 }}
        px={{ base: 6, sm: 16, lg: 36 }}
        color={'black'}
      >
        <HStack w={'full'} height={{base: '80px', md: '100px', lg: '120px'}}>
          <Box h={'full'}>
            <Image
              alt={'Logo Image'}
              fit={'cover'}
              w={'full'}
              h={'full'}
              src={
                '/assets/img/logo1.png'
              }
            />
          </Box>
          <Box h={'full'} py={'20px'}>
            <Image
              alt={'Logo Image2'}
              fit={'cover'}
              w={'full'}
              h={'full'}
              src={
                '/assets/img/logo22.png'
              }
            />
          </Box>
          <Grid flexGrow={1} />
          <Box h={'full'} py={{base: '28px', md: '35px', lg: '40px'}} paddingRight={{base: '10px', md: '15px', lg: '20px'}}>
            <Link href='https://twitter.com/apachesNFT' isExternal>
              <Image
                alt={'Twitter Image'}
                fit={'cover'}
                w={'full'}
                h={'full'}
                src={
                  '/assets/img/apaches_tw.png'
                }
              />
            </Link>
          </Box>
          <Box h={'full'} py={{base: '28px', md: '35px', lg: '40px'}}>
            <Link href='https://discord.gg/apaches' isExternal>
              <Image
                alt={'Discord Image'}
                fit={'cover'}
                w={'full'}
                h={'full'}
                src={
                  '/assets/img/apaches_discord.png'
                }
              />
            </Link>
          </Box>
        </HStack>
        <HStack w={'full'} justifyContent={'right'} marginBottom={{ base: 4, md: 8, lg: 16 }}>
          <WalletMultiButton
            style={{
              background: '#fff'
            }}
          >{!connected ? 'Connect Wallet' : null}</WalletMultiButton>
        </HStack>
        <Grid w={'full'} display={{ base: 'block', md: 'flex' }} marginBottom={'60'}>
          <GridItem
            w={{ base: '100%', md: '36%' }}
            marginTop={{base: 0, md: 6}}
          >
            <Text fontSize={{base: '3xl', md: '4xl'}} fontWeight={'bold'}>
              Apaches NFT
            </Text>
            <Text fontSize={{base: 'md', md: 'lg'}} fontWeight={'bold'}>
              Supply: 777
            </Text>
            <Text fontSize={{base: 'md', md: 'lg'}} fontWeight={'bold'}>
              Mint live! 0.5 SOL ◎
            </Text>
            <Text fontSize={{base: 'md', md: 'lg'}} fontWeight={'bold'} marginBottom={{base: 2, md: 4, lg: 8}}>
              {/* Public: Dynamic price starting at 3 ◎ */}
            </Text>
            <Box
              position={'relative'}
              rounded={'2xl'}
              width={'full'}
              overflow={'hidden'}
              my={{base: 3, md: 0}}
            >
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
          <GridItem w={{ base: '100%', md: '64%' }} paddingLeft={{ base: 0, md: 24 }}>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={'bold'} marginBottom={6} textAlign={{ base: 'center', md: 'left' }}>
              {!connected && `Please connect your wallet`}
              {
                connected && candyMachine &&
                unixTime < goLiveDate
                && `Mint day: ${formatUTC(presaleStartDate)}`
              }
              {
                connected && candyMachine &&
                unixTime > goLiveDate
                && candyMachine?.itemsRedeemed !== candyMachine?.itemsAvailable
                && `Minting Now!`
              }
              {
                connected && candyMachine &&
                unixTime > goLiveDate
                && candyMachine?.itemsRedeemed === candyMachine?.itemsAvailable
                && `Sold Out!`
              }
            </Text>
            <Box
              rounded={'2xl'}
              background={'whiteAlpha.500'}
              px={{base: 4, md: 8}}
              paddingTop={{base: 3, md: 6}}
              paddingBottom={20}
            >
              {unixTime < presaleStartDate && (
                <TimeCountdown
                  goLiveDate={presaleStartDate}
                />
              )}
              {cndyInfo && unixTime > presaleStartDate && (
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
                      {!isNaN(Number(cndyInfo.itemsAvailable)) && Number(cndyInfo.itemsAvailable) !== 0 && (
                        `[${numberWithCommas(Number(cndyInfo?.itemsRedeemed) / Number(cndyInfo.itemsAvailable) * 100, 1)}%]`
                      )}
                    </Text>
                    <Text fontSize={'2xl'} fontWeight={'bold'}>
                      {`${cndyInfo?.itemsRedeemed} / ${cndyInfo.itemsAvailable}`}
                    </Text>
                  </Flex>
                  {!isNaN(Number(cndyInfo.itemsAvailable)) && Number(cndyInfo.itemsAvailable) !== 0 && (
                    <Progress
                      height='32px'
                      width={'full'}
                      value={Number(cndyInfo?.itemsRedeemed) / Number(cndyInfo.itemsAvailable) * 100}
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
                goLiveDate={goLiveDate}
              />
              <PublicPrice
                connected={connected}
                candyMachine={candyMachine}
                price={price}
                loadingPricing={loadingPricing}
                goLiveDate={goLiveDate}
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
                    disabled
                  >
                    <Spinner />
                  </Button>
                </Flex>
              )}
              {connected && candyMachine 
                && ((unixTime > presaleStartDate && unixTime < presaleEndDate) || unixTime > goLiveDate)
                && (
                <MintButton
                  price={price}
                  onMint={onMint}
                  tokenBondingKey={tokenBonding?.publicKey}
                  goLiveDate={goLiveDate}
                  isDisabled={
                    true
                    // (!isActive && (!isPresale || !isWhitelistUser)) ||
                    // (candyMachine.isWhitelistOnly && !isWhitelistUser)
                  }
                />
              )}
              {connected && candyMachine 
                && (unixTime < presaleStartDate || (unixTime > presaleEndDate && unixTime < goLiveDate))
                && (
                <Flex>
                  <Button
                    w={'full'}
                    background={'#9a46fb'}
                    color={'white'}
                    fontSize={'2xl'}
                    fontWeight={'bold'}
                    size={'lg'}
                    disabled
                  >
                    Mint
                  </Button>
                </Flex>
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
            <Box
              position={'relative'}
              width={'full'}
              overflow={'hidden'}
            >
              <Link href='https://launchpad.libros.com/' isExternal>
                <Image
                  alt={'Sponsors Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={
                    '/assets/img/sponsors.png'
                  }
                />
              </Link>
            </Box>
            {/* <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} color={'#544a5c'}>
              Powered by LIBROS.COM
            </Text> */}
          </GridItem>
        </Grid>
      </Grid>
      <Grid w={'full'} h={'full'} paddingTop={2} paddingBottom={16} px={4} color={'white'} textAlign={'center'} fontSize={'xl'} fontWeight={'bold'}>
        <Link href='https://apaches.io/terms.htm' isExternal>
          Terms and conditions
        </Link>
      </Grid>
    </VStack>
  );
};
