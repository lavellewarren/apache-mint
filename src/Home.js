import {
  Stack,
  Flex,
  Button,
  Text,
  Heading,
  Image,
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import {
} from '@chakra-ui/react';

export default function Home() {
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
          w={{ base: '100%', md: '44%' }}
          marginTop={10}
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
                'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&q=80'
              }
            />
          </Box>
        </GridItem>
        <GridItem w={{ base: '100%', md: '56%' }} paddingLeft={{ base: 0, md: 12 }}>
          <Text fontSize={'2xl'} fontWeight={'bold'} marginBottom={6}>
            Mint day: Thursday, 11th August 6pm UTC
          </Text>
          <Box
            rounded={'2xl'}
            background={'whiteAlpha.500'}
            px={8}
            paddingTop={6}
            paddingBottom={20}
          >
            <Flex flexDirection={'row'} justifyContent={'center'} gap={'8'} marginBottom={6} color={'#725B89'}>
              <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                  17
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                  hours
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                  44
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                  minutes
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text fontSize={'4xl'} fontWeight={'bold'}>
                  27
                </Text>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                  seconds
                </Text>
              </Box>
            </Flex>
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
                  Fixed Price: 2 SOL
                </Text>
              </Box>
              <Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'}>
                Starts in 2h 33m 12s
              </Text>
            </Flex>
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
              <Text fontSize={'lg'} fontWeight={'bold'} color={'#725B89'}>
                Starts in 2h 33m 12s
              </Text>
            </Flex>
            <Flex>
              <Button
                w={'full'}
                background={'#9a46fb'}
                color={'white'}
                fontSize={'2xl'}
                fontWeight={'bold'}
                size={'lg'}
              >CONNECT WALLET</Button>
            </Flex>
          </Box>
          <Text textAlign={'center'} fontSize={'lg'} fontWeight={'bold'} color={'#544a5c'}>
            Powered by LIBROS.COM
          </Text>
        </GridItem>
      </Grid>
    </Grid>
  );
}