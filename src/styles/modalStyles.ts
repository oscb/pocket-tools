import styled, { keyframes, css } from "react-emotion";
import { Button } from "./button";

const StyleModalbase = css`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
`

const StyledModal = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StyledBg = css`
  ${StyleModalbase}
  background: #24c6dc;
  background: -webkit-linear-gradient(to bottom, #514a9d, #24c6dc);
  background: linear-gradient(to bottom, #514a9d, #24c6dc);
`

const StyledModalName = styled('h1')`
  position: relative;
  margin: 1em 0;
  z-index: 10;
  text-align: center;
  width: 100%;
  color: ${props => props.theme.bgColor};
  text-shadow: 2px 2px 2px ${props => props.theme.secondaryColor};
  font-size: 22px;
`

const CSSModalContent = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
`

const StyledModalContent = styled('div')`
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.secondaryColor};
  text-align: center;
  width: 90%;
  max-width: 500px;
  position: relative;
  border-radius: .5rem;
  box-shadow: 0 .25rem .125rem 0 rgba(0,0,0,0.1);
  /* max-height: 90%; */
  overflow: scroll;
  transition: all 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
`

const SpinKeyframe = keyframes`
  100% {
    transform: scale(2, 2);
    transform: rotate(360deg);
  }
`

const AnimateSpin = css`
  animation: ${SpinKeyframe} 1s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
`

type StyledModalIconProps = {
  spin: boolean
}

const StyledModalIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background: ${props => props.theme.mainColor};
  color: ${props => props.theme.bgColor};
  top: 1.5rem;
  // padding: 1rem;
  border-radius: 10rem;
  z-index: 10;
  transition: all 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  ${(props: StyledModalIconProps) => props.spin ? AnimateSpin : '' };
`

const StyledModalClose = styled('div')`

`

interface StyledModalButtonProps {
  primary?: boolean;
}

const StyledModalButton = styled('button')<StyledModalButtonProps>(
  {
    border: 'none',
    flex: '1 0 0',
    fontSize: '1.2rem',
    padding: '0.75rem',
    fontWeight: 'bold',
    boxSizing: 'border-box'
  }, 
  (props) => ({
    color: props.theme.bgColor,
  }), 
  (props) => (
    Button({
        color: props.primary ? 
          props.theme.mainColor : 
          props.theme.secondaryColor
      })
  )
);
StyledModalButton.defaultProps = { primary: true }

const StyledModalStatus = StyledModalButton.withComponent('div');

const StyledModalForm = styled('form')`
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  p.info {
    color: ${props => props.theme.textColorSubtle};
    font-size: 12px;
    /* margin-top: 0; */
  }

  p.error {
    font-size: 12px;
    color: ${props => props.theme.mainColor};
  }
`

const StyledSection = styled('div')`
  padding: 1rem;
  margin: 0 0 1rem 0;
`

const StyledLoaderMessage = styled('h1')`
  font-size: 1rem;
  padding: 1rem;
`

export const ModalStyles = {
  Base: StyleModalbase,
  Background: StyledBg,
  Content: StyledModalContent,
  Icon: StyledModalIcon,
  Modal: StyledModal,
  Title: StyledModalName,
  Close: StyledModalClose,
  Button: StyledModalButton,
  Form: StyledModalForm,
  Section: StyledSection,
  Status: StyledModalStatus,
  Loader: StyledLoaderMessage,
}