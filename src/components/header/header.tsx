import * as React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Logo from '../header/logo';
import './header.scss';

export interface HeaderProps {
  logo: string;
}

interface HeaderState {
  isNavOpen: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps, state: HeaderState) {
    super(props, state);
    this.state = {
      isNavOpen: false 
    };
  }

  render() {
    let nav = null;
    if (this.state.isNavOpen) {
      const children = React.Children.map(
        this.props.children,
        (child) => {
          return <li>{child}</li>;
        }
      );
      nav = (
        <nav>
          <ul>
            {children}
          </ul> 
        </nav>
      );
    }

    return (
      <header>
        <div className="container">
          <div className="logo-box">
            <Logo text={this.props.logo} />
          </div>
          <div className="nav-box">
            <a className="navToggle" href="#" onClick={(e) => this.toggleNav(e)}>
              Menu <FontAwesomeIcon icon="angle-double-down" />
            </a>
          </div>
          <div className="delivery-box">
            <div className="next-delivery">
              <h3>Next delivery:</h3>
              <h1>Wednesday Morning <FontAwesomeIcon icon="coffee" /> </h1>
              <h2>1 hour of new articles</h2>
            </div>
          </div>
        </div>
        {nav}
      </header>
    );
  }

  private toggleNav(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    this.setState((state: HeaderState) => {
      return {
        ...state, 
        isNavOpen: !state.isNavOpen
      };
    });
  }
}
