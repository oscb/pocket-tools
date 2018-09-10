import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlLabel, FormGroup, Switch, TextField } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { css } from "emotion";
import * as React from "react";
import posed from "react-pose";
import { RouteComponentProps } from "react-router";
import { $enum } from "ts-enum-util";
import { ApiHelper } from "../../models/apiHelper";
// import { hot } from "react-hot-loader";
import { Delivery, DeliveryApi, Query } from '../../models/delivery';
import { User } from "../../models/user";
import { EditorStyles } from "../../styles/deliveryEditorStyles";
import { ModalStyles } from "../../styles/modalStyles";
import CheckCircle from "./checkCircle";
import Counter, { CounterProps } from "./counter";
import Modal from "./modal";

export interface DeliveryEditorProps {}

enum CountType {
  Time = "time",
  Count = "count"
}

enum OrderBy {
  Newest = "newest",
  Oldest = "oldest"
}

enum Frequency {
  Daily = "daily",
  Weekly = "weekly"
}

enum TimeOpts {
  Morning = "morning",
  Noon = "noon",
  Afternoon = "afternoon",
  Evening = "evening",
  Midnight = "midnight"
}

enum FormStatus {
  Loading,
  Enabled,
  Saving,
  Saved
  // TODO: Might need more states
  // [Loading   ->] Enabled   -> Saving   -> Sample   -> Saving   -> Active
  //                          [Error]     <- Cancel (goes to enabled) 
}

interface DeliveryEditorState {
  // Delivery
  id?: string;
  countType: CountType;
  orderBy: OrderBy;
  frequency: Frequency;
  time: TimeOpts;
  archive: boolean;
  count: number;
  showAdvanced: boolean;
  longformOnly: boolean;
  included?: string;
  excluded?: string;
  domain?: string;
  kindle_email: string;

  // Form
  formStatus: FormStatus;
}

const ModalPose = posed.div({
  visible: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
});

class DeliveryEditor extends React.Component<
  DeliveryEditorProps & RouteComponentProps<any>,
  DeliveryEditorState
> {
  private User: User;

  constructor(props: DeliveryEditorProps & RouteComponentProps<any>, state: DeliveryEditorState) {
    super(props);
    // Default form options
    this.User = ApiHelper.userData;
    // TODO: Data in localstorage might be bad, need to have a fallback

    const defaultState: DeliveryEditorState = {
      countType: CountType.Time,
      orderBy: OrderBy.Newest,
      frequency: Frequency.Weekly,
      time: TimeOpts.Morning,
      count: 30,
      archive: true,
      showAdvanced: false,
      longformOnly: false,
      kindle_email: this.User.kindle_email,
      formStatus: FormStatus.Enabled
    }
    // TODO: Refactor the URL Routes/routers, this value can't be read if this is rendered inside dashboard
    // Check how React Router recommends to do modals
    // I could just pass the id in the component props actually...
    if (props.match.params.id) {
      this.state = {
        ...defaultState,
        formStatus: FormStatus.Loading
      }
      this.loadData(props.match.params.id);
    } else {
      this.state = defaultState;
    }
  }

  public render() {
    let counterOpts: Partial<CounterProps> = {
      onChange: x => this.setState({ ...this.state, count: x })
    };
    if (this.state.countType === CountType.Time) {
      counterOpts = {
        ...counterOpts,
        units: "min",
        min: 15,
        max: 120,
        steps: 15
      };
    } else {
      counterOpts = {
        ...counterOpts,
        units: "",
        min: 5,
        max: 20,
        steps: 5
      };
    }

    return (
      <ModalPose pose={(this.state.formStatus !== FormStatus.Enabled && this.state.formStatus !== FormStatus.Saved) ? 'hidden' : 'visible'}>
        <Modal title="New Delivery!">
          <ModalStyles.Form>
            <EditorStyles.Editor>
              <ModalStyles.Section className={css`margin-bottom: 0;`}>
                <EditorStyles.SectionTitle>
                  <span>Articles</span>
                </EditorStyles.SectionTitle>
                <EditorStyles.Fieldset>
                  <EditorStyles.Label>How many?</EditorStyles.Label>
                  <EditorStyles.Row>
                    <EditorStyles.Select
                      value={this.state.countType}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "countType",
                        id: "countType-value"
                      }}
                      // autoWidth={true}
                    >
                      <MenuItem value={CountType.Time}>By Time</MenuItem>
                      <MenuItem value={CountType.Count}>By Count</MenuItem>
                    </EditorStyles.Select>
                    {/* Switch between input and selection */}
                    <EditorStyles.Counter>
                      <Counter
                        {...counterOpts as CounterProps}
                        count={this.state.count}
                      />
                    </EditorStyles.Counter>
                  </EditorStyles.Row>
                </EditorStyles.Fieldset>
                <EditorStyles.Fieldset>
                  <EditorStyles.Label>Order By</EditorStyles.Label>
                  <EditorStyles.Select
                    value={this.state.orderBy}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "orderBy",
                      id: "orderBy-value"
                    }}
                    // autoWidth={true}
                  >
                    <MenuItem value={OrderBy.Newest}>Newest</MenuItem>
                    <MenuItem value={OrderBy.Oldest}>Oldest</MenuItem>
                  </EditorStyles.Select>
                </EditorStyles.Fieldset>
              </ModalStyles.Section>
              <EditorStyles.Toggle
                href="#"
                onClick={e => this.showAdvanced(e)}
              >
                {(!this.state.showAdvanced && "▾ Show Advanced Options") ||
                  "▴ Hide Advanced Options"}
              </EditorStyles.Toggle>
              <EditorStyles.Advanced open={this.state.showAdvanced}>
                  {/* Domain */}
                  <TextField
                    name="domain"
                    label="Domain"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="e.g. newyorker.com, theverge.com, ..."
                    fullWidth
                    value={this.state.domain}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    helperText="Leave empty to include all"
                  />

                  {/* Included Tags */}
                  <TextField
                    name="included"
                    label="Included Tags"
                    InputLabelProps={{
                      shrink: true
                    }}
                    placeholder="e.g. tech, videogames, developer notes, ..."
                    multiline
                    fullWidth
                    value={this.state.included}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    helperText="All tagged and untagged items included by default. Sepparate with commas (,)"
                  />

                  {/* Excluded Tags */}
                  <TextField
                    name="excluded"
                    label="Excluded Tags"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="e.g. funny videos, recipes, ..."
                    multiline
                    fullWidth
                    value={this.state.excluded}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    helperText="Items with any of these tags will be ignored. Sepparate with commas (,)"
                  />

                  {/* Longform only */}
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.longformOnly}
                          onChange={x =>
                            this.setState({
                              ...this.state,
                              longformOnly: !this.state.longformOnly
                            })}
                          value="longformOnly"
                        />
                      }
                      label="Longform articles only (15+ mins)?"
                    />
                  </FormGroup>
                </EditorStyles.Advanced>

              <ModalStyles.Section>
                <EditorStyles.SectionTitle>
                  <span>Delivery</span>
                </EditorStyles.SectionTitle>

                <EditorStyles.Fieldset>
                  <EditorStyles.Label>When?</EditorStyles.Label>
                  <EditorStyles.Row>
                    <Select
                      value={this.state.frequency}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "frequency",
                        id: "frequency-value"
                      }}
                      // autoWidth={true}
                    >
                      <MenuItem value={Frequency.Daily}>Daily</MenuItem>
                      <MenuItem value={Frequency.Weekly}>Weekly</MenuItem>
                      {/* <MenuItem value={Frequency.Monthly}>Monthly</MenuItem> */}
                    </Select>
                    <Select
                      value={this.state.time}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "time",
                        id: "time-value"
                        // autoWidth={true}
                      }}
                    >
                      <MenuItem value={TimeOpts.Morning}>Morning</MenuItem>
                      <MenuItem value={TimeOpts.Noon}>Noon</MenuItem>
                      <MenuItem value={TimeOpts.Afternoon}>Afternoon</MenuItem>
                      <MenuItem value={TimeOpts.Evening}>Evening</MenuItem>
                      <MenuItem value={TimeOpts.Midnight}>Midnight</MenuItem>
                    </Select>
                  </EditorStyles.Row>

                  {this.state.frequency === Frequency.Weekly && (
                    <EditorStyles.Week>
                      <CheckCircle label="M" />
                      <CheckCircle label="T" />
                      <CheckCircle label="W" />
                      <CheckCircle label="T" />
                      <CheckCircle label="F" />
                      <CheckCircle label="S" />
                      <CheckCircle label="S" />
                    </EditorStyles.Week>
                  )}

                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.archive}
                          onChange={x =>
                            this.setState({
                              ...this.state,
                              archive: !this.state.archive
                            })}
                          value="longformOnly"
                          color="primary"
                        />
                      }
                      label="Archive after delivery?"
                    />
                  </FormGroup>

                </EditorStyles.Fieldset>
              </ModalStyles.Section>
            </EditorStyles.Editor>
            <ModalStyles.Button primary={false} onClick={e => this.cancel(e)}>
              <FontAwesomeIcon icon="times" /> Cancel
            </ModalStyles.Button>
            <ModalStyles.Button onClick={e => this.save(e)}>
              Show Sample <FontAwesomeIcon icon="arrow-right" />
            </ModalStyles.Button>
          </ModalStyles.Form>
        </Modal>
      </ModalPose>
    );
  }

  private async loadData(id: string) {
    try {
      let delivery = await DeliveryApi.get(id);
      let otherDelivery = this.apiToState(delivery);
      this.setState({
        ...this.state,
        formStatus: FormStatus.Saved,
        ...otherDelivery
      });
    } catch (e) {
      // TODO: handle errors
      alert(e);
      console.error(e);
    }
  }

  private apiToState(delivery: Delivery): Partial<DeliveryEditorState> {
    const x = $enum(CountType);
    return {
      id: delivery.id,
      
      // Query
      count: delivery.query.count,
      countType: delivery.query.countType as CountType,
      orderBy: delivery.query.orderBy as OrderBy,
      frequency: delivery.frequency as Frequency,
      domain: delivery.query.domain,
      included: delivery.query.includedTags !== undefined ? delivery.query.includedTags.join(', ') : undefined,
      excluded: delivery.query.excludedTags !== undefined ? delivery.query.excludedTags.join(', ') : undefined,

      // Delivery
      time: delivery.time as TimeOpts,
      archive: delivery.autoArchive,
      longformOnly: delivery.query.longformOnly,
      kindle_email: delivery.kindle_email,

      day: "" // TODO: How to represent this? Ideas: Comma separated names/nums e.g. Monday, Tuesday or 15, 30, else bit mask 101010
    } as Partial<DeliveryEditorState>
  }

  private stateToApi(state: DeliveryEditorState): Delivery {
    return {
      id: this.state.id,
      user: this.User.id,
      kindle_email: this.state.kindle_email,
      active: false, // TODO
      query: {
        domain: this.state.domain,
        countType: this.state.countType,
        count: this.state.count,
        orderBy: this.state.orderBy,
        includedTags: this.state.included !== undefined ? this.state.included.split(',') : [],
        excludedTags: this.state.excluded !== undefined ? this.state.excluded.split(',') : [],
        longformOnly: this.state.longformOnly
      } as Query,
      frequency: this.state.frequency,
      time: this.state.time, // TODO: Revisit this when working on the scheduler
      day: "", // TODO: How is this one going to show up?
    } as Delivery;
  }

  private handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  private showAdvanced = event => {
    event.preventDefault();
    this.setState(state => {
      return {
        ...state,
        showAdvanced: !state.showAdvanced
      };
    });
  }

  private async save(e: React.MouseEvent<HTMLButtonElement>): Promise<any> {
    e.preventDefault();
    this.setState({
      ...this.state,
      formStatus: FormStatus.Saving,
    });
    let delivery = this.stateToApi(this.state);
    let resp: Promise<Delivery>;
    if (this.state.id !== undefined) {
      resp = DeliveryApi.update(delivery);
    } else {
      resp = DeliveryApi.add(delivery);
    }
    try {
      delivery = await resp;
      this.setState({
        ...this.state,
        formStatus: FormStatus.Saved,
        ...this.apiToState(delivery)
      });
      // TODO: Redirect to sample
    } catch(e) {
      // TODO: Handle errors
      alert(e);
      console.error(e);
      this.setState({
        ...this.state,
        formStatus: FormStatus.Enabled
      });
    }
  }

  private cancel(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.history.push('/dasboard');
  }
}

export default DeliveryEditor;
// export default hot(module)(DeliveryEditor);