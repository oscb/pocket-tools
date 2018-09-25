import styled, { keyframes, css } from "react-emotion";
import { Button } from "./button";
import posed from "react-pose";

const Base = css`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  /* align-items: center;
  justify-content: center; */
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
`

const Modal = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Background = css`
  ${Base}
  background: #24c6dc;
  background: -webkit-linear-gradient(to bottom, #514a9d, #24c6dc);
  background: linear-gradient(to bottom, #514a9d, #24c6dc);
`

const Title = styled('h1')`
  position: relative;
  margin: 1em 0;
  z-index: 10;
  text-align: center;
  width: 100%;
  color: ${props => props.theme.bgColor};
  text-shadow: 2px 2px 2px ${props => props.theme.secondaryColor};
  font-size: 22px;
`

const Content = styled('div')`
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.secondaryColor};
  text-align: center;
  max-width: 500px;
  position: relative;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  overflow: scroll;
  transition: all 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  margin: 1rem;
  margin-top: 0;
  margin-bottom: 2rem;
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

const Icon = styled('div')`
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

const Close = styled('div')`

`

interface StyledModalButtonProps {
  primary?: boolean;
}

const ModalButton = styled('button')<StyledModalButtonProps>(
  {
    border: 'none',
    flex: '1 0 0',
    fontSize: '1rem',
    padding: '0.75rem',
    fontWeight: 'bold',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',

    svg: {
      margin: '0 0.5rem'
    }
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
ModalButton.defaultProps = { primary: true }

const Status = ModalButton.withComponent('div');

const Form = styled('form')`
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

const Section = styled('div')`
  padding: 1rem;
  /* margin: 0 0 1rem 0; */
`

const Loader = styled('h1')`
  font-size: 1rem;
  padding: 1rem;
`

const ButtonBar = styled('div')`
  display: flex;
  width: 100%;
`

const ModalWrapperAnimated = posed.div({
  enter: { 
    opacity: 1, 
    delay: 300,
    beforeChildren: true,
  },
  exit: { 
    opacity: 0,
  }
});

const ModalWrapper = styled(ModalWrapperAnimated)`
  margin: auto;
`

const ModalBoxCSS = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
`

const ModalBox = styled('div')`
  ${ModalBoxCSS}
`

const ModalBoxAnimated = styled(
  posed.div({
    enter: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 300,
        ease: 'backOut'
      }
    },
    exit: { 
      y: 150, 
      opacity: 0,
      transition: {
        duration: 200,
        ease: 'anticipate'
      }
    }
  })
)`
  ${ModalBoxCSS}
`

export const ModalStyles = {
  Background,
  Base,
  Button: ModalButton,
  ButtonBar,
  Close,
  Content,
  Form,
  Icon,
  Loader,
  Modal,
  Section,
  Status,
  Title,
  ModalWrapper,
  ModalBox,
  ModalBoxAnimated
}