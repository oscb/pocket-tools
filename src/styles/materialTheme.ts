import { createMuiTheme } from "@material-ui/core/styles";
import { Theme } from "./theme";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: Theme.textColor
    },
    primary: {
      main: Theme.secondaryColor
    },
    error: {
      main: Theme.mainColor
    }
  },
  overrides: {
    MuiInput: {
      root: {
        width: "100%",
        fontFamily: "Alegreya Sans, sans-serif",
        color: Theme.secondaryColor // TODO: Read from Theme
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
        fontFamily: "Alegreya Sans, sans-serif",
      }
    },
    MuiCheckbox: {
      root: {
        width: "1em",
        height: "1em"
      },
      colorPrimary: {
        "&$checked": {
          color: Theme.mainColor 
        },
        "&$disabled": {
          color: Theme.textColorSubtle
        }
      },
      colorSecondary: {
        "&$checked": {
          color: Theme.mainColor 
        },
        "&$disabled": {
          color: Theme.textColorSubtle
        }
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
      }
    }
  }
});

export default theme;
