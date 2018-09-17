import styled, { keyframes } from "react-emotion";
import { Button } from "./button";

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
  border-radius: 1rem;
  color: lightgray;
  border: lightgray 2px dashed;
  text-align: center;
  font-weight: bold;
  font-family: "Roboto Slab", sans-serif;
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
  {
    border: 'none',
    flex: '1 0 auto',
    fontSize: '1rem',
    margin: '1rem',
    padding: '1rem',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: '0.5rem',
    boxShadow: '0 .25rem .125rem 0 rgba(0,0,0,0.1)',
  }, 
  (props) => ({
    color: props.theme.bgColor,
  }), 
  (props) => (
    Button({ color: props.theme.mainColor })
  )
);

export const DashboardStyles = {
  Content: Content,
  Empty: Empty,
  EmptyIcon: EmptyIcon,
  Rumble: RumbleDiv,
  Translate: TranslateTruckDiv,
  Button: NewButton,
}