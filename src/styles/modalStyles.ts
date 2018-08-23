import styled, { keyframes, css } from "react-emotion";
import { lighten, darken, desaturate } from 'polished'

const StyledModal = styled('div')`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StyledBg = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  background: #24c6dc;
  background: -webkit-linear-gradient(to bottom, #514a9d, #24c6dc);
  background: linear-gradient(to bottom, #514a9d, #24c6dc);
  opacity: 0.95;
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

const StyledModalContent = styled('div')`
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.secondaryColor};
  text-align: center;
  width: 90%;
  position: relative;
  border-radius: .5rem;
  box-shadow: 0 .25rem .125rem 0 rgba(0,0,0,0.1);
  bottom: 0;
  max-height: 90%;
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

const Button = props => css`
  background: ${props.color};

  &:hover {
    background: ${lighten(0.05, props.color)};
  }

  &:active {
    background: ${darken(0.05, props.color)};
  }

  &:disabled {
    background: ${desaturate(0.95, props.color)};
  }

  &:focus {
    outline: none;
  }
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

  label {
    font-size: 0.8rem;
    font-weight: normal;
    color: ${props => props.theme.textColor};
    text-transform: uppercase;
    width: 100%;
    display: block;
    text-align: left;
    /* margin-top: 1em; */
  }

  p.info {
    color: ${props => props.theme.textColorSubtle};
    font-size: 0.8rem;
    /* margin-top: 0; */
  }

  p.error {
    color: ${props => props.theme.mainColor};
  }
`

const StyledSection = styled('div')`
  padding: 1rem;
  margin: 0 0 1rem 0;
`

export const ModalStyles = {
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
}