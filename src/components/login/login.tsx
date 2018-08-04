import * as React from 'react';
import './login.scss';

export interface LoginProps {
    onSubmit:  (username: string, password: string) => void;
}

interface LoginState {
    username: string;
    password: string;
}

export class Login extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        // this.props = props;
        this.state = {
            username: '',
            password: ''
        };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        let field: string = event.target.name;
        let newState = { };
        newState[field] = event.target.value;
        this.setState({...this.state , ...newState});
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        console.log(this.state);
        this.props.onSubmit(this.state.username, this.state.password);
    }

    render() {
        return (
        <form className="login" onSubmit={(e) => this.handleSubmit(e)}>
            <label>Name: 
                <input type="text" name="username" value={this.state.username} onChange={(e) => this.handleChange(e)} />
            </label>
            <label>Password:
                <input type="password" name="password" />
            </label>
        </form>
        );
    }
}