import { createTheme } from '@material-ui/core/styles';
import '@fontsource/roboto';

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    palette: {
        primary: {
            main: "#47a0dc", // blue
        },
        secondary: {
            main: "#182e6b"
        },
        tertiary: {
            main: "#cfd1d2", // grey
        },
        textPrimary: {
            light: "white",
            main: "black",
            dark: "#182e6b", // dark blue
        }
    },
});

export default theme;
