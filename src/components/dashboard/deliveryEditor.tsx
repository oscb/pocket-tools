import * as React from "react";
import "./deliveryEditor.scss";
import Select from "@material-ui/core/Select";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import CheckCircle from "./checkCircle";
import { Checkbox, Divider, TextField } from "@material-ui/core";
import Counter, { CounterProps } from "./counter";
import Modal, { ModalProps } from "./modal";
// import { hot } from "react-hot-loader";
import { Delivery, Query } from '../../models/delivery';
import { RouteComponentProps } from "react-router";
import { AuthAPI } from "../../models/auth";
import { User } from "../../models/user";
import { ApiHelper } from "../../models/apiHelper";

export interface DeliveryEditorProps {}

enum CountType {
  Time,
  Count
}

enum OrderBy {
  Newest,
  Oldest
}

enum Frequency {
  Daily,
  Weekly
}

enum TimeOpts {
  Morning,
  Noon,
  Afternoon,
  Evening,
  Midnight
}

interface DeliveryEditorState {
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
}

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

    this.state = {
      countType: CountType.Time,
      orderBy: OrderBy.Newest,
      frequency: Frequency.Weekly,
      time: TimeOpts.Morning,
      count: 30,
      archive: true,
      showAdvanced: false,
      longformOnly: false,
      kindle_email: this.User.kindle_email
    };
  }

  // apiToState(delivery: Delivery): DeliveryEditorState {

  // }

  stateToApi(state: DeliveryEditorState): Delivery {
    return {
      user: this.User.id,
      kindle_email: this.state.kindle_email,
      active: true,
      query: {
        domain: this.state.domain,
        countType: CountType[this.state.countType],
        count: this.state.count,
        orderBy: OrderBy[this.state.orderBy],
        includedTags: this.state.included.split(','),
        excludedTags: this.state.excluded.split(','),
        longformOnly: this.state.longformOnly
      } as Query,
      frequency: Frequency[this.state.frequency],
      time: TimeOpts[this.state.time], // TODO: Revisit this when working on the scheduler
      day: "", // TODO: How is this one going to show up?
    } as Delivery;
  }

  handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  showAdvanded() {
    this.setState(state => {
      return {
        ...state,
        showAdvanced: !state.showAdvanced
      };
    });
  }
  render() {
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
      <Modal title="New Delivery!">
        <form className="delivery-editor">
          <div className="editor">
            <div className="section">
              <div className="main">
                <h3>
                  <span>Articles</span>
                </h3>
                <fieldset className="count">
                  <label>How many?</label>
                  <div className="row">
                    <div className="count-selection">
                      <Select
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
                      </Select>
                    </div>
                    {/* Switch between input and selection */}
                    <Counter
                      {...counterOpts as CounterProps}
                      count={this.state.count}
                    />
                  </div>
              </fieldset>
              <fieldset className="order">
                <label>Order By</label>
                <Select
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
                </Select>
              </fieldset>
            </div>
              <a
                href="#"
                className="toggleAdvanced"
                onClick={e => this.showAdvanded()}
              >
                {(!this.state.showAdvanced && "▾ Show Advanced Options") ||
                  "▴ Hide Advanced Options"}
              </a>
              <div
                className={`advanced ${
                  this.state.showAdvanced ? "open" : "close"
                }`}
              >
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
                />

                {/* Included Tags */}
                <TextField
                  name="included"
                  label="included"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="e.g. tech, videogames, developer notes, ..."
                  multiline
                  fullWidth
                  value={this.state.included}
                  onChange={e => this.handleChange(e)}
                  margin="normal"
                />

                {/* Excluded Tags */}
                <TextField
                  name="excluded"
                  label="excluded"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder="e.g. funny videos, recipes, ..."
                  multiline
                  fullWidth
                  value={this.state.excluded}
                  onChange={e => this.handleChange(e)}
                  margin="normal"
                />

                {/* Longform only */}
                <label>
                  <Checkbox
                    checked={this.state.longformOnly}
                    onChange={x =>
                      this.setState({
                        ...this.state,
                        longformOnly: !this.state.longformOnly
                      })
                    }
                  />
                  <span>Longform articles only (15+ mins)?</span>
                </label>
              </div>
            </div>

            <div className="section">
              <h3>
                <span>Delivery</span>
              </h3>

              <fieldset className="delivery">
                <label>When?</label>
                <div className="row">
                  <div className="frequency">
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
                  </div>
                  <div className="time">
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
                  </div>
                </div>

                {this.state.frequency === Frequency.Weekly && (
                  <div className="week">
                    <CheckCircle label="M" />
                    <CheckCircle label="T" />
                    <CheckCircle label="W" />
                    <CheckCircle label="T" />
                    <CheckCircle label="F" />
                    <CheckCircle label="S" />
                    <CheckCircle label="S" />
                  </div>
                )}

                <label>
                  <Checkbox
                    checked={this.state.archive}
                    onChange={x =>
                      this.setState({
                        ...this.state,
                        archive: !this.state.archive
                      })
                    }
                  />
                  <span>Archive after delivery?</span>
                </label>
              </fieldset>
            </div>
          </div>
          <button className="submit">Show Sample</button>
        </form>
      </Modal>
    );
  }
}

export default DeliveryEditor;
// export default hot(module)(DeliveryEditor);