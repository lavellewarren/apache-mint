import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { NATIVE_MINT } from "@solana/spl-token";
import { useMint, useMetaplexTokenMetadata, useSolanaUnixTime } from "@strata-foundation/react";
import { toNumber } from "@strata-foundation/spl-token-bonding";
import { formatElapsedTime } from "../utils";

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
					Fixed Price:
				</Text>
			</Box>
			<Box>
				<Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'}>
					{!isActive && <>&nbsp;</>}
					{isActive && unixTime < goLiveDate && (
						`Starts in ${formatElapsedTime(unixTime, goLiveDate)}`
					)}
					{isActive && ((unixTime > goLiveDate && unixTime < goLiveDate + 3600) || (unixTime > goLiveDate + 3600 && candyMachine.isSoldOut === false)) && <>&nbsp;</>}
					{isActive && candyMachine.isSoldOut === true && `Ended`}
				</Text>
				{!isActive && <Spinner size="lg" />}
				{isActive && (
					<Text fontSize={'xl'} fontWeight={'bold'}>
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
					</Text>
				)}
			</Box>
		</Flex>
	);
};