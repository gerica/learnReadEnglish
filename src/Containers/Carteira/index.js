import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Fab
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

import routes from '../../Utils/routes';
import * as selectorsSession from '../../Stores/Session/selector';
import * as selectorsBolsaAcoes from '../../Stores/BolsaAcoes/selector';
import BolsaAcoesActions from '../../Stores/BolsaAcoes/actions';
import { ROUTER_HOME } from '../../Utils/constants';
import { createValidator, required, phone } from '../../Utils/validation';
import CustomizedSnackbars from '../../Components/Snackbars/CustomizedSnackbars';
import TitlePage from '../../Components/AppBar/TitlePage';
import CompNovoPapel from './compNovoPapel';
import CompDescPapel from './compDescPapel';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  paper: {
    margin: theme.spacing.unit * 0.5,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    },
    cursor: 'pointer'
  },

  divRight: {
    margin: theme.spacing.unit * 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

// color: theme.palette.common.white

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class CarteiraPage extends React.Component {
  state = {
    open: false,
    openDesc: false,
    rowSelected: null,
    stateMessage: null
  };

  componentDidMount() {
    const { onFetchPapeisPorUserSuccess, user } = this.props;
    onFetchPapeisPorUserSuccess(user);
  }

  shouldComponentUpdate(nextProps) {
    const { message, onResetRedux, reset } = nextProps;

    if (message) {
      this.setState({ stateMessage: message });
      onResetRedux();
      reset();
      this.handleClose();
      this.handleCloseDesc();
    }
    return true;
  }

  onSubmit = values => {
    const { onSavePapelRequest, user } = this.props;
    onSavePapelRequest({ ...values, operacao: 'entrada', user: user.uid });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpenDesc = row => {
    this.setState({ openDesc: true, rowSelected: row });
  };

  handleCloseDesc = () => {
    this.setState({ openDesc: false, rowSelected: null });
  };

  onHandleChangeMessage = () => {
    this.setState({ stateMessage: null });
  };

  onDeletePapel = () => {
    const { onDeletePapelRequest } = this.props;
    const { rowSelected } = this.state;
    onDeletePapelRequest(rowSelected);
  };

  renderTablePapeis() {
    const { classes, listaPapeis } = this.props;
    if (!listaPapeis || listaPapeis.length === 0) {
      return null;
    }

    return (
      <Paper className={classes.paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Papel</CustomTableCell>
              <CustomTableCell align="right">Custódia</CustomTableCell>
              <CustomTableCell align="right">Preço médio</CustomTableCell>
              <CustomTableCell align="right">Cotação</CustomTableCell>
              <CustomTableCell align="right">Variação</CustomTableCell>
              <CustomTableCell align="right">Posição Atual</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaPapeis.map((row, index) => (
              <TableRow
                className={classes.row}
                key={index}
                onClick={() => this.handleOpenDesc(row)}
              >
                <CustomTableCell component="th" scope="row">
                  {row.papel}
                </CustomTableCell>
                <CustomTableCell align="right">
                  {row.quantidade}
                </CustomTableCell>
                <CustomTableCell align="right">{row.preco}</CustomTableCell>
                <CustomTableCell align="right">0</CustomTableCell>
                <CustomTableCell align="right">0</CustomTableCell>
                <CustomTableCell align="right">0</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  render() {
    const { classes, user, error, handleSubmit, loading } = this.props;
    const { stateMessage, open, openDesc, rowSelected } = this.state;

    if (!user) {
      return <Redirect to={ROUTER_HOME} />;
    }

    const routerHome = routes.find(r => r.order === 1);
    const routerCarteira = routes.find(r => r.order === 2);
    const listRouters = [routerHome];

    return (
      <div className={classes.root}>
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
        <TitlePage routerMain={routerCarteira} routerList={listRouters} />
        <Fab
          color="primary"
          aria-label="Add"
          className={classes.fab}
          onClick={this.handleClickOpen}
        >
          <AddIcon />
        </Fab>
        {this.renderTablePapeis()}
        {
          <CompNovoPapel
            open={open}
            onSubmit={handleSubmit(this.onSubmit)}
            handleClose={this.handleClose}
            loading={loading}
          />
        }
        {
          <CompDescPapel
            papel={rowSelected}
            open={openDesc}
            handleClose={this.handleCloseDesc}
            onDelete={this.onDeletePapel}
          />
        }
      </div>
    );
  }
}

CarteiraPage.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onSavePapelRequest: PropTypes.func.isRequired,
  onDeletePapelRequest: PropTypes.func.isRequired,
  onResetRedux: PropTypes.func.isRequired,
  message: PropTypes.string,
  loading: PropTypes.bool
};

CarteiraPage.defaultProps = {
  message: null
};

const mapStateToProps = createStructuredSelector({
  user: selectorsSession.selectorSessionUser(),
  message: selectorsBolsaAcoes.selectorMessage(),
  loading: selectorsBolsaAcoes.selectorLoading(),
  listaPapeis: selectorsBolsaAcoes.selectorListaPapeis()
});

const mapDispatchToProps = dispatch => ({
  onSavePapelRequest: payload =>
    dispatch(BolsaAcoesActions.savePapelRequest(payload)),
  onDeletePapelRequest: payload =>
    dispatch(BolsaAcoesActions.deletePapelRequest(payload)),
  onFetchPapeisPorUserSuccess: user =>
    dispatch(BolsaAcoesActions.fetchPapeisPorUserRequest(user)),
  onResetRedux: () => dispatch(BolsaAcoesActions.resetRedux())
});

const validate = createValidator({
  contato: [required, phone]
});

const reduxFormPerfilEdit = reduxForm({ form: 'perfilEditPage', validate })(
  CarteiraPage
);
const CarteiraPageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxFormPerfilEdit);

export default withStyles(styles, { withTheme: true })(CarteiraPageRedux);
