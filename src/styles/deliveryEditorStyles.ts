import styled, { css, keyframes } from 'react-emotion';
import { Select } from '@material-ui/core';

const StyledToggleAdvanced = styled('a')`
  color: ${props => props.theme.textColorSubtle};
  font-size: 12px;
  text-transform: uppercase;
  text-decoration: none;
  display: block;
  margin-bottom: 1rem;
`

type AdvancedProps = {
  open: boolean
}

const expand = keyframes`
  0%, from {
    max-height: 0;
  }

  100%, to {
    max-height: 1000px;
  }
`

const contract = keyframes`
  0%, from {
    max-height: 1000px;
  }

  100%, to {
    max-height: 0;
  }
`

const StyledAdvanced = styled('div')<AdvancedProps>(
  {
    padding: '0 1rem',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.1)',
    maxHeight: 0,
  }, 
  (props) => ({
    animation: `${props.open ? expand : contract} 1s cubic-bezier(0.0, 0, 0.2, 1) 0s 1 forwards`,
  })
);


const StyledEditor = styled('div')``

const StyledSectionRow = styled('div')`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;


  & > * {
    flex: 1 1 auto;
  }
`

const StyledFieldSet = styled('div')`
  border: none;
  margin: 0.5rem 0 1rem 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
`

const StyledSectionTitle = styled('h3')`
  color: ${props => props.theme.mainColor};
  margin: 0;
  text-align: center;

  span {
    background: ${props => props.theme.bgColor};
    z-index: 15;
    position: relative;
    width: 200%;
  }

  &:before {
    content: "";
    border-bottom: 1px ${props => props.theme.mainColor} solid;
    display: block;
    position: relative;
    top: 0.75em;
    width: 100%;
  }
`

const StyledEditorWeek = styled('div')`
  display: flex;
  width: 100%;
  margin: 1rem 0;
  justify-content: center;
  align-content: center;
`

const StyledEditorCounter = styled('div')`
  flex: 0 1 15rem;
  margin-left: 2rem;
  vertical-align: top;
`

const StyledSelect = styled(Select)`
  flex: 1 1 100%;
`

const StyledLabel = styled('label')`
  font-size: 12px; /* 16px * 0.75 of scaling in a normal component */
  font-weight: normal;
  color: ${props => props.theme.textColor};
  text-transform: uppercase;
  width: 100%;
  display: block;
  text-align: left;
`

export const EditorStyles = {
  Counter: StyledEditorCounter,
  Week: StyledEditorWeek,
  SectionTitle: StyledSectionTitle,
  Fieldset: StyledFieldSet,
  Row: StyledSectionRow,
  Editor: StyledEditor,
  Advanced: StyledAdvanced,
  Toggle: StyledToggleAdvanced,
  Select: StyledSelect,
  Label: StyledLabel
}