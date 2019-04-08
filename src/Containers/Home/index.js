import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  Collapse
} from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';
import { blue, green } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TextInputBase from '../../Components/Form/TextInputBase';

import * as selectors from '../../Stores/Texto/selector';
import * as selectorsSession from '../../Stores/Session/selector';
import TextoActions from '../../Stores/Texto/actions';
import CustomizedProgress from '../../Components/Progress/CustomizedProgress';
import { ViewCards } from './styles';
import CustomizedSnackbars from '../../Components/Snackbars/CustomizedSnackbars';
import TitlePage from '../../Components/AppBar/TitlePage';
import Routes from '../../Utils/routes';
import { createValidator, required } from '../../Utils/validation';
import EditTranslate from '../../Components/Dialog/editTranslate';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  card: {
    // maxWidth: 400,
    // width: 200,
    // height: 260,
    margin: 5
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex',
    justifyContent: 'center'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '44.8%',
    left: '9.5%',
    marginTop: -12,
    marginLeft: -12
  }
});

class HomePage extends Component {
  state = { expanded: false, open: false, selected: null, stateMessage: null };

  componentWillMount() {
    const { onReset } = this.props;
    onReset();
    // const { initialize } = this.props;
    // // moment.to;
    // initialize({
    //   texto: 'It is easy to configure.'
    // });
  }

  shouldComponentUpdate(nextProps) {
    const { message, onResetMessage } = nextProps;

    if (message) {
      this.setState({ stateMessage: message });
      onResetMessage();
    }
    return true;
  }

  onSubmit = values => {
    const { onCompileTextWords, user } = this.props;

    onCompileTextWords({ values, user });
  };

  getRacaDescricao(raca) {
    if (raca) {
      return raca.length > 100 ? `${raca.substr(0, 10)}...` : raca;
    }
    return '';
  }

  getStyle(word) {
    if (word.addFlashCards) {
      return { backgroundColor: green[100] };
    }
    return {};
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleDoneText = word => {
    const { onDoneTextWordsRequest, user } = this.props;
    onDoneTextWordsRequest({ word, user });
  };

  handleAddFlashCard = word => {
    const { onDoneTextWordsRequest, user } = this.props;
    onDoneTextWordsRequest({ word: { ...word, addFlashCards: true }, user });
  };

  handleOpenDialog = word => {
    this.setState({ open: true, selected: word });
  };

  handleCloseDialog = () => {
    this.setState({ open: false, selected: null });
  };

  onHandleChangeMessage = () => {
    this.setState({ stateMessage: null });
  };

  onSubmitEdit = values => {
    const { selected } = this.state;
    const { onAddTextBaseDescription, user } = this.props;
    selected.translate = values.description;
    onAddTextBaseDescription({ word: selected, user });
    this.handleCloseDialog();
  };

  renderCards() {
    const { classes, handleSubmit, loading, text } = this.props;
    const { expanded } = this.state;
    const routerHome = Routes.find(r => r.order === 1);

    return (
      <div className={classes.root}>
        <TitlePage routerMain={routerHome} />
        <div>
          <Card className={classes.card}>
            <CardHeader
              title="Text for compiler"
              action={
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: expanded
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              }
            />
            <Collapse in={!expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Field
                  name="texto"
                  label="Texto"
                  className={classes.textField}
                  required
                  adornmentIcon="textsms"
                  component={TextInputBase}
                  multiline
                  rows="4"
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={handleSubmit(this.onSubmit)}
                  disabled={loading}
                >
                  Compilar
                </Button>
              </CardActions>
            </Collapse>
          </Card>
        </div>
        <div style={{ display: 'flex' }}>
          <Card className={classes.card} style={{ width: '100%' }}>
            <CardHeader title="Text" />
            <CardContent>{text}</CardContent>
          </Card>
          {this.renderWordsCard()}
        </div>
      </div>
    );
  }

  renderWordsCard() {
    const { listWords, classes } = this.props;

    if (!listWords) {
      return null;
    }
    if (listWords.length === 0) {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography component="p">
              Congratulations you know all words, nice !!!
            </Typography>
          </CardContent>
        </Card>
      );
    }
    const cards = listWords.map((w, index) => (
      <Card className={classes.card} key={index} style={this.getStyle(w)}>
        {/* <CardHeader title='teste' /> */}

        <CardContent>
          {w.origin} - {w.translate}
        </CardContent>
        <CardActions>
          <Tooltip title="Já aprendi">
            <IconButton
              color="primary"
              className={classes.button}
              aria-label="Add an alarm"
              onClick={() => this.handleDoneText(w)}
            >
              <Icon>done</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="FlashCard">
            <IconButton
              color="primary"
              className={classes.button}
              aria-label="Add an alarm"
              onClick={() => this.handleAddFlashCard(w)}
            >
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Custom ">
            <IconButton
              color="primary"
              className={classes.button}
              aria-label="Add an alarm"
              onClick={() => this.handleOpenDialog(w)}
            >
              <Icon>more_vert</Icon>
            </IconButton>
          </Tooltip>
          {/* <IconButton color="secondary" className={classes.button} aria-label="Add an alarm">
          <Icon>favorite_border</Icon>
        </IconButton>                          */}
        </CardActions>
      </Card>
    ));

    return (
      <div
        className={classes.root}
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        {cards}
      </div>
    );
  }

  render() {
    const { loading, error } = this.props;
    const { open, selected, stateMessage } = this.state;
    return (
      <Fragment>
        {open ? (
          <EditTranslate
            open={open}
            handleCloseDialog={this.handleCloseDialog}
            item={selected}
            onSubmit={this.onSubmitEdit}
          />
        ) : null}
        {stateMessage ? (
          <CustomizedSnackbars
            message={stateMessage}
            variant="success"
            onCleanMsg={this.onHandleChangeMessage}
          />
        ) : null}
        {error ? (
          <CustomizedSnackbars message={error.message} variant="error" />
        ) : null}
        {loading ? <CustomizedProgress /> : null}
        <ViewCards>{this.renderCards()}</ViewCards>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  onCompileTextWords: PropTypes.func,
  onReset: PropTypes.func,
  loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  handleSubmit: PropTypes.func.isRequired,
  // listaCotacaoDia: PropTypes.checkPropTypes(PropTypes.array),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  listWords: PropTypes.array,
  user: PropTypes.object,
  text: PropTypes.string,
  onAddTextBaseDescription: PropTypes.func,
  onResetMessage: PropTypes.func,
  message: PropTypes.string
};

HomePage.defaultProps = {
  onCompileTextWords: null,
  loading: null,
  // listaCotacaoDia: [],
  error: null,
  user: null
};

const mapStateToProps = createStructuredSelector({
  listWords: selectors.selectorListWords(),
  message: selectors.selectorMessage(),
  loading: selectors.selectorLoading(),
  error: selectors.selectorError(),
  user: selectorsSession.selectorSessionUser(),
  text: selectors.selectorText()
});

const mapDispatchToProps = dispatch => ({
  onCompileTextWords: papel =>
    dispatch(TextoActions.compileTextWordsRequest(papel)),
  onDoneTextWordsRequest: payload =>
    dispatch(TextoActions.doneTextWordsRequest(payload)),
  onReset: () => dispatch(TextoActions.resetRedux()),
  onAddTextBaseDescription: payload =>
    dispatch(TextoActions.addTextBaseDescriptionRequest(payload)),
  onResetMessage: () => dispatch(TextoActions.resetMessage())
});

const validate = createValidator({
  texto: [required]
});

const reduxHomePage = reduxForm({ form: 'perfilEditPage', validate })(HomePage);

const connectHomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxHomePage);

export default withStyles(styles)(connectHomePage);
