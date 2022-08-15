import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
	Link,
} from '@chakra-ui/react';

export default function Maintenance() {
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={
        'url(/assets/img/background.png)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}>
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
            We will be live soon...
          </Text>
          <Stack direction={'row'} w={'full'} justifyContent={'center'}>
						<Link href='https://twitter.com/apachesNFT' isExternal>
							<Button
								bg={'blue.400'}
								rounded={'full'}
								color={'white'}
								_hover={{ bg: "blue.500" }}>
								Tweet Us...
							</Button>
						</Link>
          </Stack>
        </Stack>
      </VStack>
    </Flex>
  );
}