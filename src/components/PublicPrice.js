import {
	Box,
	Flex,
	Text,
} from "@chakra-ui/react";
import { numberWithCommas } from "@strata-foundation/marketplace-ui";
import { useMetaplexTokenMetadata, useSolanaUnixTime } from "@strata-foundation/react";
import React, { useEffect, useState } from "react";
import { formatElapsedTime } from "../utils";
import BN from "bn.js";

const presaleStartDate = Number(process.env.REACT_APP_PRESALE_STARTDATE ? process.env.REACT_APP_PRESALE_STARTDATE : 1660575600);
const presaleEndDate = presaleStartDate + Number(process.env.REACT_APP_PRESALE_DURATION ? process.env.REACT_APP_PRESALE_DURATION : 3600);
const dynamicPricingDuration = Number(process.env.REACT_APP_DYNAMINT_DURATION ? process.env.REACT_APP_DYNAMINT_DURATION : 7200);

export const PublicPrice = ({
	connected,
	candyMachine,
	loadingPricing,
	price,
	goLiveDate
}) => {
	const isActive = connected && !!candyMachine && !!goLiveDate;

	const { metadata } = useMetaplexTokenMetadata(
		candyMachine?.tokenMint
	);

	const solanaUnixTime = useSolanaUnixTime();

	const [unixTime, setUnixTime] = useState(Math.round(Date.now() / 1000));

	useEffect(() => {
		setUnixTime(solanaUnixTime || Math.round(Date.now() / 1000));
	}, [solanaUnixTime]);

	return (
		<Flex
			flexDirection={'row'}
			justifyContent={'space-between'}
			background={'#e9dde0'}
			px={6}
			py={5}
			marginBottom={20}
			gap={2}
		>
			<Box>
				<Text fontSize={'lg'} fontWeight={'bold'} marginBottom={1} color={'#725B89'}>
					Public Mint
				</Text>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					{unixTime < goLiveDate + dynamicPricingDuration && 'Dynamic Price'}
					{unixTime > goLiveDate + dynamicPricingDuration && 'Price: 0.50'}
					&nbsp;
				</Text>
			</Box>
			<Box textAlign={'right'}>
				<Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'} marginBottom={1}>
					{unixTime > presaleEndDate && unixTime < goLiveDate && (
						`Starts in ${formatElapsedTime(unixTime, goLiveDate)}`
						)}
					{(unixTime > goLiveDate && unixTime < goLiveDate + dynamicPricingDuration) && (
						`Ends in ${formatElapsedTime(unixTime, goLiveDate + dynamicPricingDuration)}`
						)}
					{!!candyMachine && (unixTime > goLiveDate + dynamicPricingDuration && candyMachine.isSoldOut === true)
						? `Ended`
						: unixTime > goLiveDate + dynamicPricingDuration ? 'Active' : null
					}
					&nbsp;
				</Text>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					{unixTime < goLiveDate + dynamicPricingDuration && unixTime > presaleEndDate && (loadingPricing || typeof price == "undefined") && isActive && candyMachine.isSoldOut === true && 
						`${numberWithCommas((new BN(candyMachine.price.toNumber())).div(new BN(10 ** 9)).toNumber(), 9)} SOL`
					}
					{unixTime < goLiveDate + dynamicPricingDuration && unixTime > presaleEndDate && !(loadingPricing || typeof price == "undefined") && 
						`${isNaN(price)
							? "Not Started"
							: metadata?.data.symbol === "USDC"
							? `$${numberWithCommas(price, 2)}`
							: `${numberWithCommas(price, 4)} ${
								metadata?.data.symbol
							}`}`
					}
					&nbsp;
				</Text>
			</Box>
		</Flex>
	);
};
