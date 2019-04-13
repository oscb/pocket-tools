import posed from "react-pose";

export const AnimatedListItem = posed.div({
  enter: { 
    x: 0, 
    opacity: 1,
  },
  exit: { 
    x: 200, 
    opacity: 0,
  }
});