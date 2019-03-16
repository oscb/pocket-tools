import styled from '@emotion/styled';
import { css, keyframes } from "@emotion/core";
import { Select } from '@material-ui/core';
import posed from 'react-pose';

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

export const AdvancedStyles = css`
  padding: 0 1rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.1);
  max-height: 0;
`


const StyledEditor = styled('div')`
  width: 100%;
`

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
  margin: 0.5rem 0 0 0;
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
  flex: 0 1 24rem;
  padding-left: 2rem;
  vertical-align: top;
`

// const StyledSelect = styled(Select)`
//   flex: 1 1 100%;
// `
const StyledSelect = Select;

const StyledLabel = styled('label')`
  font-size: 12px; /* 16px * 0.75 of scaling in a normal component */
  font-weight: normal;
  color: ${props => props.theme.textColor};
  text-transform: uppercase;
  width: 100%;
  display: block;
  text-align: left;
`

const PreviewBarAnimated = posed.div({
  enter: { 
    y: 0, 
    opacity: 1,
  },
  exit: { 
    y: 100, 
    opacity: 0,
  }
});

const PreviewBar = styled(PreviewBarAnimated)`
  position: fixed; 
  bottom: 0; 
  width: 90%; 
  max-width: 400px;
  display: flex;
  border-radius: 1rem 1rem 0 0;
  overflow: hidden;
`

const PreviewAnimated = posed.div({
  enter: { 
    staggerChildren: 50 
  },
  exit: { 
    staggerChildren: 20, 
    staggerDirection: -1 
  }
});

const Preview = styled(PreviewAnimated)`
  margin: 1.5rem;
  margin-top: 0;
  margin-bottom: 3rem;
  max-width: 500px;
`

const EmptyResults = styled('div')`
  color: ${props => props.theme.secondaryColor};
  font-size: 1.5rem;
  font-family: ${props => props.theme.titleFont};
  padding: 1rem;
  max-width: 300px;
  text-align: center;
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
  Label: StyledLabel,
  PreviewBar,
  Preview,
  EmptyResults
}