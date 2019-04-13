import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { Button } from "./button";
import posed from "react-pose";

const Content = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
`

const Empty = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  margin: 2rem;
  width: 100%;
  max-width: 350px;
  border-radius: ${props => props.theme.borderRadius};
  color: lightgray;
  border: lightgray 2px dashed;
  text-align: center;
  font-weight: bold;
  font-family: ${props => props.theme.titleFont};
`

const TruckKeyframes = keyframes`
  0% {
    left: -25%
  }

  50% {
    left: calc(50% - 1.5rem);
  }

  100% {
    left: 100%;
  }
`

const RumbleFrames = keyframes`
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(1px);
  }
`

const EmptyIcon = styled('div')`
  color: lightgray;
  font-size: 3rem;
`

const TranslateTruckDiv = styled('div')`
  position: absolute;
  animation: ${TruckKeyframes} 5s cubic-bezier(.19,1,.22,1) infinite;
`

const RumbleDiv = styled('div')`
  animation: ${RumbleFrames} 100ms ease infinite alternate;
`

const NewButton = styled('button')(
  (props) => (
    Button({ color: props.theme.mainColor })
  ),
  (props) => ({
    borderRadius: props.theme.borderRadius,
    color: props.theme.bgColor,
    boxShadow: props.theme.boxShadow,
    background: props.theme.mainColor, // Default
  }),
  {
    border: 'none',
    flex: '1 0 auto',
    fontSize: '1rem',
    margin: '1rem',
    padding: '1rem',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '350px'
  },
);

const EditButton = styled('button')(
  {
    border: 'none',
    flex: '1 0 auto',
    fontSize: '1rem',
    margin: '1rem',
    padding: '1rem',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '350px'
  }, 
  (props) => ({
    borderRadius: props.theme.borderRadius,
    color: props.theme.bgColor,
    boxShadow: props.theme.boxShadow
  }), 
  (props) => (
    Button({ color: props.theme.secondaryColor })
  )
);

const DeliveryListAnimated = posed.div({
  enter: { 
    staggerChildren: 50,
    opacity: 1,
  },
  exit: { 
    staggerChildren: 20, 
    staggerDirection: -1,
    opacity: 0,
  }
});

const DeliveryList = styled(DeliveryListAnimated)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const Logout = styled('a')`
  text-align: center;
  text-decoration: underline;
  color: ${props => props.theme.textColor};
  margin-top: 2rem;
`


export const DashboardStyles = {
  Content: Content,
  Empty: Empty,
    EmptyIcon: EmptyIcon,
  Rumble: RumbleDiv,
  Translate: TranslateTruckDiv,
  Button: NewButton,
  SecondaryButton: EditButton,
  DeliveryList,
  Logout
}