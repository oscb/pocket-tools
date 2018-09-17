import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import Modal, { ModalContainerAnimated } from "../dashboard/modal";
import { TextField } from "@material-ui/core";
import { User, UserApi } from '../../models/user';
import Loader from "../loader/loader";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalStyles } from "../../styles/modalStyles";
import { css } from "emotion";
import posed, { PoseGroup } from "react-pose";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface UserProfileProps {
  newUser: boolean;
}

enum FormState {
  Preloading,
  Loading,
  Enabled,
  Saving,
  Saved
}

interface UserProfileState extends User {
  formState: FormState,
  // TODO: Mix these 2 togheter
  errors: {[field: string]: boolean};
  saveError?: string;
}

export default class UserProfile extends React.Component<
  UserProfileProps & RouteComponentProps<any>,
  UserProfileState
> {
  private minWaitTime: number = 500;
  private timeout: NodeJS.Timer;

  constructor(
    props: UserProfileProps & RouteComponentProps<any>,
    state: UserProfileState
  ) {
    super(props);

    let router_state: Partial<UserProfileState> = this.props.history.location
      .state;
    if (router_state) {
      state = {
        ...router_state,
        ...state
      };
    }
    this.loadUserData();

    this.timeout = setTimeout(
      () => {
        console.log("Wait's over!");
        this.setState({
          ...this.state,
          formState: FormState.Loading
        });
      },
      this.minWaitTime
    )

    this.state = {
      formState: FormState.Preloading,
      errors: {},
      ...state
    };
  }

  async loadUserData() {
    let user = await UserApi.me();
    clearTimeout(this.timeout);
    this.setState({
      ...this.state,
      formState: FormState.Enabled,
      id: user.id,
      username: user.username,
      email: user.email,
      kindle_email: user.kindle_email
    });
  }

  validateEmail = (email: string): boolean => {
    return emailRegex.test(email.toLowerCase());
  }

  validateKindleEmail = (email: string):boolean =>  {
    return this.validateEmail(email) && email.toLowerCase().endsWith('@kindle.com');
  }

  validateForm(): boolean {
    return this.state.kindle_email !== undefined && 
      this.state.email !== undefined && 
      this.validateKindleEmail(this.state.kindle_email) &&
      this.validateEmail(this.state.email);
  }

  debouncedValidation = (validator: (field: string) => boolean) =>  _.debounce((key: string, value: string) => {
    let errors: {[field: string]: boolean} = {};
    errors[key] = !validator(value);

    this.setState({
      ...this.state,
      errors: {
        ...this.state.errors,
        ...errors
      }
    });
  }, 500);
  
  handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 
    validate?: ((key: string, value: string) => void) & _.Cancelable)
  {
    if(validate !== undefined) {
      validate(event.target.name, event.target.value);
    }

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      formState: this.state.formState !== FormState.Saving ? FormState.Enabled : this.state.formState
    });
  };

  save = event => {
    event.preventDefault();
    if (!this.validateForm()) {
      this.setState({
        ...this.state,
        saveError: "There was an error saving your data, verify that all fields are correct and try again.",
        errors: {
          ...this.state.errors,
          'save': true
        }
      });
      return;
    }
    this.setState({
      ...this.state,
      formState: FormState.Saving,
    });

    let { 
      // Only these fields are editable
      id, 
      kindle_email, 
      email, 
      ...other } = this.state;
    const userData: Partial<User> = {
      id: id, 
      kindle_email: kindle_email,
      email: email
    };
      

    UserApi.update(userData).then(() => {
      // TODO: Update User Data
      this.setState({
        ...this.state,
        formState: FormState.Saved,
        errors: {}
      });
      setTimeout(() => {
        this.props.history.push("/dashboard");
      }, 2000);
    }).catch((e) => {
      let detail = e.response.body.error !== undefined ? e.response.body.error : '';
      this.setState({
        ...this.state,
        formState: FormState.Enabled,
        saveError: `There was an error saving your data. Status:${e.status} Message: ${e.message} ${detail}. Try again later. If you keep seeing this error send an email to support@pockettoolkit.com` ,
        errors: {
          ...this.state.errors,
          'save': true
        }
      });
    });
  };

  checkErrors(name: string): boolean {
    return name in this.state.errors && this.state.errors[name];
  }

  cancel(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.history.push('/dasboard');
  }

  render() {
    return (
      <PoseGroup>
        {this.state.formState === FormState.Loading && 
        <ModalContainerAnimated key="loader">
          <Loader key="loader" message="Loading your user data" />
        </ModalContainerAnimated>
        }
        {this.state.formState !== FormState.Preloading && 
        this.state.formState !== FormState.Loading &&
        <ModalContainerAnimated key="form">
          <Modal 
            key="userForm"
            title={this.props.newUser ? "Setup your account!" : "Account"} 
            icon={this.state.formState === FormState.Saving ? 'sync' : this.state.formState === FormState.Saved ? 'check' : 'user'} 
            spin={this.state.formState === FormState.Saving}
            iconStyle={this.state.formState === FormState.Saved ? { background: 'rgba(39, 94, 132, 1)'} : {}}
            close={() => this.cancel()}
          >
            <ModalStyles.Form>
              <ModalStyles.Section>

                <TextField
                  name="username"
                  label="Pocket Username"
                  InputLabelProps={{
                    shrink: true
                  }}
                  style={{marginTop: 0}}
                  fullWidth
                  value={this.state.username}
                  margin="normal"
                  disabled
                />
                <TextField
                  error={this.checkErrors('email')}
                  helperText={this.checkErrors('email') ? "Enter a valid email" : undefined}
                  name="email"
                  label="Email"
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled={this.state.formState === FormState.Saving}
                  fullWidth
                  placeholder="your_email@gmail.com"
                  value={this.state.email}
                  onChange={e => this.handleChange(e, this.debouncedValidation(this.validateEmail))}
                  margin="normal"
                />
                <TextField
                  error={this.checkErrors('kindle_email')}
                  helperText={this.checkErrors('kindle_email') ? "Enter a valid email ending with @kindle.com" : undefined}
                  name="kindle_email"
                  label="Kindle Email"
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled={this.state.formState === FormState.Saving}
                  fullWidth
                  placeholder="your_kindle@kindle.com"
                  value={this.state.kindle_email}
                  onChange={e => this.handleChange(e, this.debouncedValidation(this.validateKindleEmail))}
                  margin="normal"
                />
                <p className="info">
                  {/* TODO: Add quick copy button to copy the email! */}
                  <i>
                    Remember to give access to deliveries@pockettools.xyz in to your
                    approved email list in Amazon!{" "}
                    <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=201974240">
                      Learn more
                    </a>
                  </i>
                </p>
                {
                this.checkErrors('save') &&
                <p className="info error">
                  {this.state.saveError}
                </p>
                }
              </ModalStyles.Section>

              {this.state.formState === FormState.Saving && <ModalStyles.Status>Saving...</ModalStyles.Status>}
              {this.state.formState === FormState.Saved && <ModalStyles.Status>Saved!</ModalStyles.Status>}
              {this.state.formState === FormState.Enabled && !this.props.newUser && 
                <ModalStyles.Button primary={false} onClick={e => this.cancel(e)}>
                  <FontAwesomeIcon icon="times" /> Cancel
                </ModalStyles.Button>
              }
              {this.state.formState === FormState.Enabled && 
              <ModalStyles.Button disabled={!this.validateForm()} onClick={e => this.save(e)}>
                Save
              </ModalStyles.Button>
              }
            </ModalStyles.Form>
          </Modal>
        </ModalContainerAnimated>
        } 
      </PoseGroup>
    );
  }
}
