import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    components: {
        Progress: {
            baseStyle: {
                filledTrack: {
                    bg: '#568c74'
                }
            }
        }
    }
});

export default theme;