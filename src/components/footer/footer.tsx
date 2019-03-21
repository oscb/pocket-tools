import * as React from 'react';
import styled from '@emotion/styled';

const StyledFooter = styled('div')`
    position:absolute;
    bottom:0;
    width:100%;
    height: 20px;
    color: ${props => props.theme.secondaryColor};
    font-size: 0.7em;
`

export class Footer extends React.Component {

    render() {
        return (
            <StyledFooter>
                <div className="copyright">Pocket Tools © by Oscar Bazaldua</div>
            </StyledFooter>
        );
    }
}