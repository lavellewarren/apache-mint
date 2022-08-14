import {
	Box,
	Flex,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { numberWithCommas } from "@strata-foundation/marketplace-ui";
import { useMetaplexTokenMetadata, useSolanaUnixTime } from "@strata-foundation/react";
import React, { useEffect, useState } from "react";
import { formatElapsedTime } from "../utils";
import BN from "bn.js";


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

	useEffect(() => {
		console.log(goLiveDate, 'goLiveDate')
	}, [goLiveDate]);

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
					Dynamic Price
				</Text>
			</Box>
			<Box>
				<Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'}>
					{!isActive && <>&nbsp;</>}
					{isActive && (unixTime < goLiveDate || (unixTime > goLiveDate && unixTime < goLiveDate + 3600)) && (
						`Starts in ${formatElapsedTime(unixTime, goLiveDate + 3600)}`
					)}
					{isActive && (unixTime > goLiveDate + 3600 && candyMachine.isSoldOut === false) && <>&nbsp;</>}
					{isActive && candyMachine.isSoldOut === true && `Ended`}
				</Text>
				{loadingPricing || typeof price == "undefined"
				? isActive && candyMachine.isSoldOut
					? <Text fontSize={'xl'} fontWeight={'bold'}>
							{`${numberWithCommas((new BN(candyMachine.price.toNumber())).div(new BN(10 ** 9)).toNumber(), 9)} SOL`}
						</Text>
					: (
						<Spinner size="lg" />
					)
				: (
					<Text fontSize={'xl'} fontWeight={'bold'}>
						Price:&nbsp;
							{isNaN(price)
								? "Not Started"
								: metadata?.data.symbol === "USDC"
								? `$${numberWithCommas(price, 2)}`
								: `${numberWithCommas(price, 4)} ${
									metadata?.data.symbol
								}`}
					</Text>
				)}
			</Box>
		</Flex>
	);
};
