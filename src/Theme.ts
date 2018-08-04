import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    text: {
      primary: "rgba(39, 94, 132, 1)"
    },
    primary: {
      main: "rgba(39, 94, 132, 1)"
    }
  },
  overrides: {
    MuiInput: {
      root: {
        width: "100%",
        fontFamily: "Alegreya Sans, sans-serif",
        color: "rgba(39, 94, 132, 1)"
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
      }
    },
    MuiCheckbox: {
      root: {
        width: "1em",
        height: "1em"
      },
      colorPrimary: {
        "&$checked": {
          color: "rgba(255, 118, 132, 1)"
        },
        "&$disabled": {
          color: "#9f9f9f"
        }
      },
      colorSecondary: {
        "&$checked": {
          color: "rgba(255, 118, 132, 1)"
        },
        "&$disabled": {
          color: "#9f9f9f"
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
    }
  }
});

export default theme;
