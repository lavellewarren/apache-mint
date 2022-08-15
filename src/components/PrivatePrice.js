import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { useMint, useMetaplexTokenMetadata, useSolanaUnixTime } from "@strata-foundation/react";
import { toNumber } from "@strata-foundation/spl-token-bonding";
import { formatElapsedTime } from "../utils";

const presaleStartDate = Number(process.env.REACT_APP_PRESALE_STARTDATE ? process.env.REACT_APP_PRESALE_STARTDATE : 1660575600);
const presaleEndDate = presaleStartDate + Number(process.env.REACT_APP_PRESALE_DURATION ? process.env.REACT_APP_PRESALE_DURATION : 3600);

export const PrivatePrice = ({ connected, candyMachine, isWhitelistUser, discountPrice, goLiveDate }) => {
	const isActive = connected && !!candyMachine && goLiveDate !== undefined;

	const { metadata, loading: loadingMeta } = useMetaplexTokenMetadata(
		candyMachine?.tokenMint
	);
	const ticker = loadingMeta ? "" : metadata?.data.symbol || "SOL";
	const targetMint = useMint(candyMachine?.tokenMint || NATIVE_MINT);

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
			marginBottom={6}
			gap={2}
		>
			<Box>
				<Text fontSize={'lg'} fontWeight={'bold'} marginBottom={1} color={'#725B89'}>
					WL Mint
				</Text>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					Fixed Price
				</Text>
			</Box>
			<Box textAlign={'right'}>
				<Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'} marginBottom={1}>
					{unixTime < presaleStartDate && (
						`Starts in ${formatElapsedTime(unixTime, presaleStartDate)}`
					)}
					{(unixTime > presaleStartDate && unixTime < presaleEndDate) && (
						`Ends in ${formatElapsedTime(unixTime, presaleEndDate)}`
					)}
					{unixTime > presaleEndDate && `Ended`}
					&nbsp;
				</Text>
				<Text fontSize={'xl'} fontWeight={'bold'}>
					{unixTime < presaleEndDate
						? isActive && isWhitelistUser && discountPrice
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
							: ""
						: 'Ended'
					}
				</Text>
			</Box>
		</Flex>
	);
};