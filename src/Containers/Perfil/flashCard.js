/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { green } from '@material-ui/core/colors';

import * as selectors from '../../Stores/Texto/selector';
import * as selectorsSession from '../../Stores/Session/selector';
import TextoActions from '../../Stores/Texto/actions';

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paperTitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
    // marginTop: theme.spacing.unit * 3
  },
  card: {
    width: '30%',
    marginTop: theme.spacing.unit * 3
  },
  buttonAnswer: {
    color: green[500]
  },
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
  toggleShowAnswer = () => {
    const { answer } = this.state;
    this.setState({ answer: !answer });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paperTitle}>
          <Typography variant="h4"> Flash Cards Configuration</Typography>
        </Paper>
      </div>
    );
  }
}

FlashCardPage.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
  loading: selectors.selectorLoading(),
  error: selectors.selectorError(),
  user: selectorsSession.selectorSessionUser(),
  listWordsForUser: selectors.selectorListWordsForUser()
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(TextoActions.resetRedux())
});

const connectFlashCardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCardPage);

export default withStyles(styles)(connectFlashCardPage);
