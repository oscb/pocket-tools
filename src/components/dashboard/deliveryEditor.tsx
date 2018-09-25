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
// import { hot } from "react-hot-loader";
import { Delivery, DeliveryApi, Query, Article } from '../../models/delivery';
import { User } from "../../models/user";
import { EditorStyles, AdvancedStyles } from "../../styles/deliveryEditorStyles";
import { ModalStyles } from "../../styles/modalStyles";
import CheckCircle from "./checkCircle";
import Counter, { CounterProps } from "./counter";
import Modal, { CSSModalContent } from "./modal";
import Loader from "../loader/loader";
import ArticleItem from "./articleItem";
import { hot } from "react-hot-loader";
import { DashboardStyles } from "../../styles/dashboardStyles";

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
  Preloading,
  Loading,
  Enabled,
  Saving,
  Preview,
  Activating,
  Finished
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

  // Preview
  preview?: Article[]
}

const ArticleAnimated = posed.div({
  enter: { 
    x: 0, 
    opacity: 1,
  },
  exit: { 
    x: 100, 
    opacity: 0,
  }
});

const AdvancedSection = posed.div({
  open: {
    maxHeight: 500
  },
  close: {
    maxHeight: 0
  }
})

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
      archive: true,
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
          <div className={css`${CSSModalContent}`}>
            <ModalStyles.Title>This is your next delivery!</ModalStyles.Title>
            
            <EditorStyles.Preview key="previewList">
              {this.state.preview.map(article => (
                <ArticleAnimated key={article.item_id}>
                  <ArticleItem 
                    key={article.resolved_id}
                    title={article.resolved_title} 
                    image={article.top_image_url} 
                    url={article.resolved_url}
                    timeToRead={article.time_to_read} />
                </ArticleAnimated>
              ))}
            </EditorStyles.Preview>
            <EditorStyles.PreviewBar>
              <ModalStyles.Button primary={false} onClick={this.goBackToEditor}>
                <FontAwesomeIcon icon="edit" /> Edit again
              </ModalStyles.Button>
              <ModalStyles.Button onClick={this.activate}>
                Complete! <FontAwesomeIcon icon="check" />
              </ModalStyles.Button>
            </EditorStyles.PreviewBar>
          </div>
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
        includedTags: this.parseTags(this.state.included),
        excludedTags: this.parseTags(this.state.excluded),
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
          this.props.history.push('/dashboard');
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