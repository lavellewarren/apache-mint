import {
	Box,
	Flex,
	Text,
} from "@chakra-ui/react";
import { useSolanaUnixTime } from "@strata-foundation/react";
import React, { useEffect, useState } from "react";


export const TimeCountdown = ({
	goLiveDate
}) => {
    const [elapsedHours, setElapsedHours] = useState(0);
	const [elapsedMinutes, setElapsedMinutes] = useState(0);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
    
	const solanaUnixTime = useSolanaUnixTime();

	useEffect(() => {
        if (goLiveDate === undefined) return;

        const unixTime = solanaUnixTime || Math.round(Date.now() / 1000);
        if (goLiveDate < unixTime) {
            setElapsedHours(0);
            setElapsedMinutes(0);
            setElapsedSeconds(0);
            return;
        }
        const timediff = goLiveDate - unixTime;
        const _elapsedHours = Math.round((timediff - timediff % 3600) / 3600);
        const _elapsedMinutes = Math.round(((timediff - _elapsedHours * 3600 - (timediff - _elapsedHours * 3600) % 60)) / 60);
        const _elapsedSeconds = timediff - _elapsedHours * 3600 - _elapsedMinutes * 60;
        setElapsedHours(_elapsedHours);
        setElapsedMinutes(_elapsedMinutes);
        setElapsedSeconds(_elapsedSeconds);
	}, [goLiveDate, solanaUnixTime]);

	return (
        <Flex flexDirection={'row'} justifyContent={'center'} gap={'8'} marginBottom={6} color={'#725B89'}>
            <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                    {elapsedHours}
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                    hours
                </Text>
            </Box>
            <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                    {elapsedMinutes}
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                    minutes
                </Text>
            </Box>
            <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                    {elapsedSeconds}
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                    seconds
                </Text>
            </Box>
        </Flex>
    );
};
