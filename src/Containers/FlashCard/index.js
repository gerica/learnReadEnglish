/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Icon,
  CardHeader
} from '@material-ui/core';
import { green, yellow, red } from '@material-ui/core/colors';

import * as selectors from '../../Stores/FlashCard/selector';
import * as selectorsSession from '../../Stores/Session/selector';
import FlashCardActions from '../../Stores/FlashCard/actions';
import Routes from '../../Utils/routes';
import TitlePage from '../../Components/AppBar/TitlePage';
import {
  ANSWER_MEDIDUM,
  ANSWER_DIFFICULT,
  ANSWER_EASY
} from '../../Utils/constants';
import CustomizedProgress from '../../Components/Progress/CustomizedProgress';
// theme
const styles = () => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  paperTitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
    // marginTop: theme.spacing.unit * 3
  },
  card: {
    // maxWidth: 400,
    // width: 200,
    // height: 260,
    width: '35%',
    margin: 5
  },
  buttonAnswer: {
    color: green[500]
  },
  divInner: {},
  divCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  paperAnswer: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class FlashCardPage extends React.Component {
  componentWillMount() {
    const { onFetchFlashCardForUser, user } = this.props;
    onFetchFlashCardForUser({ user });
  }

  toggleShowAnswer = () => {
    const { onToggleShowAnswer } = this.props;
    onToggleShowAnswer();
  };

  handleAnswerFlashCard = answer => {
    const { onAnswerFlashCardRequest, selectedCard } = this.props;
    onAnswerFlashCardRequest({ answer, card: selectedCard });
  };

  renderFlashCard() {
    const { classes, selectedCard, showAnswer, listFlasCard } = this.props;

    if (!selectedCard || !listFlasCard) {
      return (
        <Paper className={classes.paperTitle}>
          <Typography variant="h4"> No have flash cards</Typography>
        </Paper>
      );
    }
    const titleDesc = `Flash Card Learn: cadas(${listFlasCard.length})`;

    return (
      <div className={classes.divCenter}>
        <Card className={classes.card}>
          <CardHeader title={titleDesc} />
          <CardContent>
            <CardContent>
              <Typography variant="h4">
                Word: {selectedCard.word.origin}
              </Typography>
              {showAnswer ? (
                <Paper className={classes.paperAnswer}>
                  <Typography variant="h3">
                    {selectedCard.word.translate}
                  </Typography>
                </Paper>
              ) : (
                <div className={classes.divCenter}>
                  <IconButton
                    color="primary"
                    className={classes.buttonAnswer}
                    aria-label="Add an alarm"
                    onClick={this.toggleShowAnswer}
                  >
                    <Icon style={{ fontSize: 130 }}>fiber_manual_record</Icon>
                  </IconButton>
                </div>
              )}
            </CardContent>
            {showAnswer ? (
              <CardActions className={classes.actions} disableActionSpacing>
                <Button
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: green[300] }}
                  onClick={() => this.handleAnswerFlashCard(ANSWER_EASY)}
                >
                  Easy
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: yellow[300] }}
                  onClick={() => this.handleAnswerFlashCard(ANSWER_MEDIDUM)}
                >
                  Medium
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: red[300] }}
                  onClick={() => this.handleAnswerFlashCard(ANSWER_DIFFICULT)}
                >
                  Difficult
                </Button>
              </CardActions>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  }

  render() {
    const { classes, loading } = this.props;
    const routerPage = Routes.find(r => r.order === 3);

    return (
      <div className={classes.root}>
        {loading ? <CustomizedProgress /> : null}
        <TitlePage routerMain={routerPage} />
        {this.renderFlashCard()}
      </div>
    );
  }
}

FlashCardPage.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedCard: PropTypes.object,
  user: PropTypes.object,
  onFetchFlashCardForUser: PropTypes.func.isRequired,
  onAnswerFlashCardRequest: PropTypes.func.isRequired,
  onToggleShowAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  listFlasCard: PropTypes.array
};

FlashCardPage.defaultProps = {
  selectedCard: null
};

const mapStateToProps = createStructuredSelector({
  loading: selectors.selectorLoading(),
  error: selectors.selectorError(),
  user: selectorsSession.selectorSessionUser(),
  selectedCard: selectors.selectorSelectedCard(),
  showAnswer: selectors.selectorShowAnswer(),
  listFlasCard: selectors.selectorListFlasCard()
});

const mapDispatchToProps = dispatch => ({
  onFetchFlashCardForUser: payload =>
    dispatch(FlashCardActions.fetchFlashCardForUserRequest(payload)),
  onAnswerFlashCardRequest: payload =>
    dispatch(FlashCardActions.answerFlashCardRequest(payload)),
  onToggleShowAnswer: () => dispatch(FlashCardActions.toggleShowAnswer()),
  reset: () => dispatch(FlashCardActions.resetRedux())
});

const connectFlashCardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCardPage);

export default withStyles(styles)(connectFlashCardPage);
