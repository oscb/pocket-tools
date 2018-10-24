import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlLabel, FormGroup, Switch, TextField } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { css } from "emotion";
import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { RouteComponentProps } from "react-router";
import { $enum } from "ts-enum-util";
import { ApiHelper } from "../../models/apiHelper";
import { Delivery, DeliveryApi, Query, Article } from '../../models/delivery';
import { User } from "../../models/user";
import { EditorStyles, AdvancedStyles } from "../../styles/deliveryEditorStyles";
import { ModalStyles } from "../../styles/modalStyles";
import CheckCircle from "./checkCircle";
import Counter, { CounterProps } from "./counter";
import Modal from "./modal";
import Loader from "../loader/loader";
import ArticleItem from "./articleItem";
import { hot } from "react-hot-loader";
import { TimeOpts, localToUtc, UtcToLocal, WeekDays } from "../../time";

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

enum FormStatus {
  Preloading,
  Loading,
  Enabled,
  Saving,
  Preview,
  Activating,
  Finished
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
  autoArchive: boolean;
  count: number;
  showAdvanced: boolean;
  longformOnly: boolean;
  included?: string;
  excluded?: string;
  domain?: string;
  kindle_email: string;
  day?: string[];

  // Form
  formStatus: FormStatus;

  // Preview
  preview?: Article[]
}

const AdvancedSection = posed.div({
  open: {
    maxHeight: 500
  },
  close: {
    maxHeight: 0
  }
});

// Timeslot values


class DeliveryEditor extends React.Component<
  DeliveryEditorProps & RouteComponentProps<any>,
  DeliveryEditorState
> {
  private User: User;
  private minWaitTime: number = 500;
  private timeout: NodeJS.Timer;
  private isNew: boolean;

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
      autoArchive: true,
      showAdvanced: false,
      longformOnly: false,
      kindle_email: this.User.kindle_email,
      formStatus: FormStatus.Enabled
    }
    
    if (props.match.params.id) {
      this.state = {
        ...defaultState,
        formStatus: FormStatus.Preloading  
      }

      this.timeout = setTimeout(
        () => {
          this.setState({
            ...this.state,
            formStatus: FormStatus.Loading
          });
        },
        this.minWaitTime
      );

      this.loadData(props.match.params.id);
      this.isNew = false;
    } else {
      this.isNew = true;
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
      <PoseGroup>
      {this.state.formStatus === FormStatus.Loading && 
        <ModalStyles.ModalWrapper key="loadingDelivery">
          <Loader key="loader" message="Loading delivery" />
        </ModalStyles.ModalWrapper>
      }
      {this.state.formStatus === FormStatus.Enabled &&
        <ModalStyles.ModalWrapper key="form">
          <Modal title={this.state.id !== undefined ? "Your Delivery" : "New Delivery!"}>
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
                        {Object.keys(CountType)
                          .filter(key => isNaN(Number(key)))
                          .map(item => <MenuItem key={item} value={CountType[item]}>{item}</MenuItem>)}
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
                      {Object.keys(OrderBy)
                        .filter(key => isNaN(Number(key)))
                        .map(item => <MenuItem key={item} value={OrderBy[item]}>{item}</MenuItem>)}
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
                  <AdvancedSection pose={this.state.showAdvanced ? "open" : "close"} className={css`${AdvancedStyles}`}>
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

                      {/* Kindle Email */}
                      <TextField
                        name="kindle_email"
                        label="Kindle Email"
                        InputLabelProps={{
                          shrink: true
                        }}
                        fullWidth
                        placeholder="your_kindle@kindle.com"
                        value={this.state.kindle_email}
                        onChange={e => this.handleChange(e)}
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
                    </FormGroup>
                  </AdvancedSection>

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
                        {Object.keys(Frequency)
                          .filter(key => isNaN(Number(key)))
                          .map(item => <MenuItem key={item} value={Frequency[item]}>{item}</MenuItem>)}
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
                        {Object.keys(TimeOpts)
                          .filter(key => isNaN(Number(key)))
                          .map(item => <MenuItem key={item} value={TimeOpts[item]}>{item}</MenuItem>)}
                      </Select>
                    </EditorStyles.Row>

                    {this.state.frequency === Frequency.Weekly && (
                      <EditorStyles.Week>
                        {Object.keys(WeekDays)
                        .filter(key => isNaN(Number(key)))
                        .map(item => {
                          
                          return <CheckCircle 
                            key={item}
                            label={item.substring(0, 1)} 
                            checked={(this.state.day !== undefined && this.state.day.indexOf(item) !== -1)} 
                            onCheck={(prev) => {
                              if (prev) {
                                this.setState({
                                  ...this.state,
                                  day: this.state.day.filter(x => x !== item)
                                });
                              } else {
                                this.setState({
                                  ...this.state,
                                  day: this.state.day !== undefined ? [...this.state.day, item] : [item]
                                });
                              }
                            }}/>;
                        })}
                      </EditorStyles.Week>
                    )}

                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.autoArchive}
                            onChange={x =>
                              this.setState({
                                ...this.state,
                                autoArchive: !this.state.autoArchive
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
              <ModalStyles.ButtonBar>
                <ModalStyles.Button primary={false} onClick={this.cancel}>
                  <FontAwesomeIcon icon="times" /> Cancel
                </ModalStyles.Button>
                <ModalStyles.Button onClick={this.save}>
                  Show Sample <FontAwesomeIcon icon="arrow-right" />
                </ModalStyles.Button>
              </ModalStyles.ButtonBar>
            </ModalStyles.Form>
          </Modal>
        </ModalStyles.ModalWrapper>
      }
      {this.state.formStatus === FormStatus.Saving && 
        <ModalStyles.ModalWrapper key="loadingPreview">
          <Loader key="loader" message="Saving your delivery and loading preview..." />
        </ModalStyles.ModalWrapper>
      }
      {this.state.formStatus === FormStatus.Preview && 
        <ModalStyles.ModalWrapper key="preview">
          <ModalStyles.ModalBox>
            {(this.state.preview === undefined || this.state.preview.length === 0) && 
              <EditorStyles.EmptyResults>
                🤔<br/> 
                No articles in your Pocket match your query. No worries, we will send articles if we find any!
              </EditorStyles.EmptyResults>
            }
              {this.state.preview !== undefined && this.state.preview.length > 0 && 
              <React.Fragment>
                <ModalStyles.Title>This is your next delivery!</ModalStyles.Title>
                <EditorStyles.Preview key="previewList">
                  {this.state.preview.map(article => (
                    <ArticleItem 
                      key={article.resolved_id}
                      title={article.resolved_title} 
                      image={article.top_image_url} 
                      url={article.resolved_url}
                      timeToRead={article.time_to_read} />
                  ))}
                </EditorStyles.Preview>
              </React.Fragment>
            }
            <EditorStyles.PreviewBar>
              <ModalStyles.Button primary={false} onClick={this.goBackToEditor}>
                <FontAwesomeIcon icon="edit" /> Edit again
              </ModalStyles.Button>
              <ModalStyles.Button onClick={this.activate}>
                Complete! <FontAwesomeIcon icon="check" />
              </ModalStyles.Button>
            </EditorStyles.PreviewBar>
          </ModalStyles.ModalBox>
        </ModalStyles.ModalWrapper>
      }
      {this.state.formStatus === FormStatus.Activating && 
        <ModalStyles.ModalWrapper key="activating">
          <Loader key="loader" message="Activating your delivery..." />
        </ModalStyles.ModalWrapper>
      }
      {this.state.formStatus === FormStatus.Finished && 
        <ModalStyles.ModalWrapper key="done">
          <Modal
            key="doneModal"
            title="" 
            icon='check'
            spin={false}
            className={css`
              width: 250px;
            `}
          >
            <ModalStyles.Loader>
              Delivery Ready! 😄
            </ModalStyles.Loader>
          </Modal>
        </ModalStyles.ModalWrapper>
      }
      </PoseGroup>
    );
  }

  private async loadData(id: string) {
    try {
      const delivery = await DeliveryApi.get(id);
      clearTimeout(this.timeout);
      const stateDelivery = this.apiToState(delivery);
      this.setState({
        ...this.state,
        formStatus: FormStatus.Enabled,
        ...stateDelivery,
        showAdvanced: 
          (!!delivery.query.domain || 
          (!!delivery.query.includedTags && delivery.query.includedTags.length > 0) || 
          (!!delivery.query.excludedTags && delivery.query.excludedTags.length > 0) || 
          delivery.query.longformOnly)
      });
    } catch (e) {
      // TODO: handle errors
      alert(e);
      console.error(e);
    }
  }

  private apiToState(delivery: Delivery): Partial<DeliveryEditorState> {
    const [time, days] = UtcToLocal(TimeOpts[delivery.time], delivery.day);

    return {
      id: delivery.id,
      
      // Query
      count: delivery.query.count,
      countType: CountType[delivery.query.countType],
      orderBy: OrderBy[delivery.query.orderBy],
      frequency: Frequency[delivery.frequency],
      domain: delivery.query.domain,
      included: delivery.query.includedTags !== undefined ? delivery.query.includedTags.join(', ') : undefined,
      excluded: delivery.query.excludedTags !== undefined ? delivery.query.excludedTags.join(', ') : undefined,

      // Delivery
      time: time,
      days: days,
      autoArchive: delivery.autoArchive,
      longformOnly: delivery.query.longformOnly,
      kindle_email: delivery.kindle_email,
    } as Partial<DeliveryEditorState>
  }

  private parseTags(tagsField?: string): string[] {
    if (
      tagsField !== undefined && 
      tagsField !== null && 
      tagsField.trim().length > 0
    ) {
      return tagsField.split(',').map(x => x.trim()).filter(x => x.length > 0);
    }
    return [];
  }

  private stateToApi(state: DeliveryEditorState): Delivery {
    const offset = new Date().getTimezoneOffset();
    const [time, days] = localToUtc(this.state.time, this.state.day);

    return {
      id: this.state.id,
      user: this.User.id,
      kindle_email: this.state.kindle_email,
      active: false,
      query: {
        count: this.state.count,
        countType: CountType[this.state.countType],
        domain: this.state.domain,
        excludedTags: this.parseTags(this.state.excluded),
        includedTags: this.parseTags(this.state.included),
        longformOnly: this.state.longformOnly,
        orderBy: OrderBy[this.state.orderBy],
      } as Query,
      frequency: Frequency[this.state.frequency],
      time: TimeOpts[time],
      timezone: offset,
      autoArchive: this.state.autoArchive,
      day: days,
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

  private save = async (e: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    const minTime = 1500;
    const startTime = new Date().getTime();
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
      const articles = await DeliveryApi.preview(delivery.id);

      const timeSoFar = new Date().getTime() - startTime;
      const nextStep = () => {
        this.setState({
          ...this.state,
          formStatus: FormStatus.Preview,
          ...this.apiToState(delivery),
          preview: articles
        });
      }
      if (timeSoFar > minTime) {
        nextStep();
      } else {
        setTimeout(nextStep, minTime - timeSoFar);
      }
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

  private cancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (this.isNew && this.state.id !== undefined) {
      DeliveryApi.delete(this.state.id!);
    }
    this.props.history.push('/dashboard');
  }

  private activate = async (e: React.MouseEvent<HTMLButtonElement>): Promise<any> => {
    const doneMessageTime = 3000;
    const minTime = 1500;
    const startTime = new Date().getTime();
    e.preventDefault();

    this.setState({
      ...this.state,
      formStatus: FormStatus.Activating,
    });

    try {
      await DeliveryApi.update({
        id: this.state.id,
        active: true
      });
      const timeSoFar = new Date().getTime() - startTime;
      const nextStep = () => {
        this.setState({
          ...this.state,
          formStatus: FormStatus.Finished,
        });
        // TODO: Trigger a reload in Dashboard
        setTimeout(() => {
          this.props.history.push('/dashboard', { reload: true } );
        }, doneMessageTime);
      }
      if (timeSoFar > minTime) {
        nextStep();
      } else {
        setTimeout(nextStep, minTime - timeSoFar);
      }
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

  private goBackToEditor = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      formStatus: FormStatus.Enabled,
      preview: []
    });
  }
}

// export default DeliveryEditor;
export default hot(module)(DeliveryEditor);