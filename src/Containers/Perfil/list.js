/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Card, CardContent, CardActions, Button } from '@material-ui/core';

import * as selectors from '../../Stores/Texto/selector';
import * as selectorsSession from '../../Stores/Session/selector';
import TextoActions from '../../Stores/Texto/actions';
import EnhancedTableHead from '../../Components/Table/EnhancedTableHead';

function desc(a, b, orderBy) {
  // console.log({ orderBy });
  // console.log(b.word[orderBy]);
  // console.log(a.word[orderBy]);
  if (b.word[orderBy] < a.word[orderBy]) {
    return -1;
  }
  if (b.word[orderBy] > a.word[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          List of word that you read
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 2,
    display: 'flex'
  },
  divInner: {
    width: '100%'
    // marginTop: theme.spacing.unit * 3
  },
  paper: {
    width: '100%'
    // marginTop: theme.spacing.unit * 3
  },
  paperInner: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  margins: {
    marginLeft: theme.spacing.unit * 3
  },
  table: {
    minWidth: '100%'
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: theme.spacing.unit * 3
  }
});

const rows = [
  { id: 'origin', numeric: false, disablePadding: false, label: 'Origin' },
  { id: 'translate', numeric: false, disablePadding: false, label: 'Translate' }
];

class ListaPalavrasPage extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'origin',
    selected: null,
    page: 0,
    rowsPerPage: 10
  };

  componentWillMount() {
    const { onFetchAllWordsForUserRequest, user } = this.props;
    onFetchAllWordsForUserRequest({ user });
  }

  // shouldComponentUpdate(nextProps) {
  //   const { listWordsForUser } = nextProps;
  //   const { selected } = this.state;

  //   if (listWordsForUser && selected) {
  //     const word = listWordsForUser.find(l => {
  //       return (
  //         l.word.id === selected.word.id &&
  //         l.addFlashCards !== selected.addFlashCards
  //       );
  //     });
  //     if (word) {
  //       this.setState({ selected: null });
  //     }
  //   }

  //   return true;
  // }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { listWordsForUser } = this.props;
    const word = listWordsForUser.find(l => l.id === id);
    this.setState({ selected: word });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleForgetWord = () => {
    const { onForgetWord, user } = this.props;
    const { selected } = this.state;
    onForgetWord({ word: selected, user });
    this.setState({ selected: null });
  };
  
  handleAddFlashCard = () => {
    const { onAddFlashCard, user } = this.props;
    const { selected } = this.state;
    onAddFlashCard({ word: selected, user });
    this.setState({ selected: null });
  };
  
  handleRemoveFlashCard = () => {
    const { onRemoveFlashCard, user } = this.props;
    const { selected } = this.state;
    onRemoveFlashCard({ word: selected, user });
    this.setState({ selected: null });
  };

  isSelected = id => {
    const { selected } = this.state;
    return selected && selected.id === id;
  };

  render() {
    const { classes, listWordsForUser } = this.props;
    const { order, orderBy, rowsPerPage, page, selected } = this.state;
    if (!listWordsForUser) {
      return null;
    }
    if (listWordsForUser.length === 0) {
      return (
        <Card className={classes.card}>
          <CardContent>
            <Typography component="p">Begin to read !!!</Typography>
          </CardContent>
        </Card>
      );
    }
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, listWordsForUser.length - page * rowsPerPage);

    return (
      <div className={classes.root}>
        <div className={classes.divInner}>
          <Paper
            className={classes.paper}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Typography variant="h4"> List of word you know</Typography>
          </Paper>
          <Paper className={classes.paper}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                  rows={rows}
                />
                <TableBody>
                  {stableSort(listWordsForUser, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(n => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          hover
                          onClick={event => this.handleClick(event, n.id)}
                          tabIndex={-1}
                          key={n.id}
                          selected={isSelected}
                        >
                          <TableCell align="left">{n.word.origin}</TableCell>
                          <TableCell align="left">{n.word.translate}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Paper>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listWordsForUser.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
        <div className={classes.divInner}>
          {selected ? (
            <div className={classes.margins}>
              <Paper
                className={classes.paper}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Typography variant="h4"> Word</Typography>
              </Paper>
              <Card className={classes.paperInner}>
                <CardContent>
                  Origin:
                  <Typography variant="h5" style={{ padding: 5 }}>
                    {' '}
                    {selected.word.origin}
                  </Typography>
                  Translate:
                  <Typography variant="h5" style={{ padding: 5 }}>
                    {' '}
                    {selected.word.translate}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={this.handleForgetWord}
                  >
                    Forget
                  </Button>
                  {selected.addFlashCards ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={this.handleRemoveFlashCard}
                    >
                      Remove Flash Card
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={this.handleAddFlashCard}
                    >
                      Add Flash Card
                    </Button>
                  )}
                </CardActions>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

ListaPalavrasPage.propTypes = {
  classes: PropTypes.object.isRequired,
  listWordsForUser: PropTypes.array,
  user: PropTypes.object,
  onFetchAllWordsForUserRequest: PropTypes.func.isRequired,
  onForgetWord: PropTypes.func.isRequired,
  onAddFlashCard: PropTypes.func.isRequired,
  onRemoveFlashCard: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  loading: selectors.selectorLoading(),
  error: selectors.selectorError(),
  user: selectorsSession.selectorSessionUser(),
  listWordsForUser: selectors.selectorListWordsForUser()
});

const mapDispatchToProps = dispatch => ({
  onFetchAllWordsForUserRequest: payload =>
    dispatch(TextoActions.fetchAllWordsForUserRequest(payload)),
  reset: () => dispatch(TextoActions.resetRedux()),
  onForgetWord: payload => dispatch(TextoActions.forgetWordRequest(payload)),
  onAddFlashCard: payload =>
    dispatch(TextoActions.addFlashCardRequest(payload)),
  onRemoveFlashCard: payload =>
    dispatch(TextoActions.removeFlashCardRequest(payload))
});

const connectListaPalavrasPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListaPalavrasPage);

export default withStyles(styles)(connectListaPalavrasPage);
