import React, { useEffect, useMemo, useState } from "react";
import { useTokenBonding, useCapInfo, useSolanaUnixTime } from "@strata-foundation/react";
import { Center, Text } from "@chakra-ui/react";
import { Countdown } from "./Countdown";

export const LbcStatus = ({
  tokenBondingKey,
  goLiveDate: inputGoLiveDate,
}) => {
  const { info: tokenBonding } = useTokenBonding(tokenBondingKey);
  const goLiveDate = useMemo(() => {
    if (inputGoLiveDate) {
      return inputGoLiveDate;
    }

    if (tokenBonding) {
      const date = new Date(0);
      date.setUTCSeconds(tokenBonding.goLiveUnixTime.toNumber());
      return date;
    }
  }, [tokenBonding, inputGoLiveDate]);
  const [isLive, setIsLive] = useState(true);
  const unixTime = useSolanaUnixTime();
  const unixTimeDate = useMemo(() => {
    const date = new Date(0);
    date.setUTCSeconds(unixTime || (new Date().valueOf() / 1000));
    return date;
  }, [unixTime]);
  useEffect(() => {
    setIsLive(goLiveDate ? goLiveDate < unixTimeDate : true);
  }, [goLiveDate, unixTime, unixTimeDate]);
  const { numRemaining } = useCapInfo(tokenBondingKey);
  const isSoldOut = typeof numRemaining !== "undefined" && numRemaining <= 0;

  if (isSoldOut) {
    return (
      <Center
        rounded="lg"
        borderColor="primary.500"
        borderWidth="1px"
        padding={4}
      >
        <Text fontWeight={600} color="primary.500">
          SOLD OUT
        </Text>
      </Center>
    );
  } else if (!isLive && goLiveDate) {
    return <Countdown date={goLiveDate} />;
  } else {
    return null;
  }
};
