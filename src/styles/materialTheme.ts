import { createMuiTheme } from "@material-ui/core/styles";
import { Theme } from "./theme";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    text: {
      primary: Theme.textColor
    },
    primary: {
      main: Theme.secondaryColor
    },
    secondary: {
      main: Theme.mainColor
    },
    error: {
      main: Theme.mainColor
    }
  },
  overrides: {
    MuiInput: {
      root: {
        width: "100%",
        fontFamily: "Alegreya Sans, Helvetica, sans-serif",
        color: Theme.secondaryColor
      },
      underline: {
        "&:after": {
          // borderBottom: '1px solid rgba(39, 94, 132, 1)', // color3
        },
        "&:before": {
          // borderBottom: '1px solid rgba(39, 94, 132, 1)', // color3
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          // borderBottom: '2px solid rgba(255, 118, 132, 1)', // color2
        }
      },
    },
    MuiFormHelperText: {
      root: {
        fontFamily: "Alegreya Sans, Helvetica, sans-serif",
      }
    },
    MuiSelect: {
      root: {
        position: "relative",
        width: "100%"
      },
      select: {
        textAlign: "left"
      }
    },
    MuiFormLabel: {
      root: {
        marginTop: 0,
        fontSize: '16px',
        fontWeight: 'normal',
        color: Theme.textColor,
        fontFamily: "Alegreya Sans, Helvetica, sans-serif",
      }
    },
    MuiInputLabel: {
      shrink: {
        textTransform: 'uppercase',
      }
    }
  }
});

export default theme;
