/* eslint-disable prefer-destructuring */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
// import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';

import * as selectors from '../../Stores/BolsaAcoes/selector';
import BolsaAcoesActions from '../../Stores/BolsaAcoes/actions';
import CustomizedProgress from '../../Components/Progress/CustomizedProgress';
import { ViewCards } from './styles';
import CustomizedSnackbars from '../../Components/Snackbars/CustomizedSnackbars';
import TitlePage from '../../Components/AppBar/TitlePage';
import Routes from '../../Utils/routes';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  card: {
    // maxWidth: 400,
    width: 200,
    height: 260,
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
  avatar: {
    // backgroundColor: red[500]
  }
});

class HomePage extends Component {
  componentWillMount() {
    // const { fetchCotacaoRequest, reset } = this.props;
    // fetchCotacaoRequest('ABEV3.SA');
    // reset();
  }

  getRacaDescricao(raca) {
    if (raca) {
      return raca.length > 100 ? `${raca.substr(0, 10)}...` : raca;
    }
    return '';
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleWhatsApp = contato => {
    if (contato) {
      const text = 'Gostaria de adotar seu pet.';
      const link = `https://api.whatsapp.com/send?phone=55${contato}&text=${text}`;
      window.open(link, '_blank');
    }
  };

  renderCards() {
    const { classes, listaCotacaoDia } = this.props;
    const routerHome = Routes.find(r => r.order === 1);

    const GlobalQuote = listaCotacaoDia['Global Quote'];
    //     01. symbol: "MSFT"
    // 02. open: "119.5000"
    // 03. high: "119.5890"
    // 04. low: "117.0400"
    // 05. price: "117.0500"
    // 06. volume: "33624528"
    // 07. latest trading day: "2019-03-22"
    // 08. previous close: "120.2200"
    // 09. change: "-3.1700"
    // 10. change percent: "-2.6368%"

    if (listaCotacaoDia) {
      return (
        <div className={classes.root}>
          <TitlePage routerMain={routerHome} />

          <Card className={classes.card}>
            <CardHeader title={`Papel: ${GlobalQuote['01. symbol']}`} />

            <CardContent>
              <Typography component="div">
                Abertura: {GlobalQuote['02. open']}
              </Typography>
              <Typography component="div">
                Máximo: {GlobalQuote['03. high']}
              </Typography>
              <Typography component="div">
                Mínimo: {GlobalQuote['04. low']}
              </Typography>
              <Typography component="div">
                Volume: {GlobalQuote['06. volume']}
              </Typography>
              <Typography component="div">
                Dia: {GlobalQuote['07. latest trading day']}
              </Typography>
              <Typography component="div">
                Fechamento: {GlobalQuote['08. previous close']}
              </Typography>
              <Typography component="div">
                Variação: {GlobalQuote['09. change']}
              </Typography>
              <Typography component="div">
                Variação(%): {GlobalQuote['10. change percent']}
              </Typography>
            </CardContent>
            {/* <CardActions className={classes.actions} disableActionSpacing>
            <Button
              variant="contained"
              style={MyTheme.palette.success}
              className={classes.button}
              // onClick={() => this.handleClickOpen(obj)}
            >
              Ver
              <Icon className={classes.rightIcon}>arrow_forward</Icon>
            </Button>
          </CardActions> */}
          </Card>
        </div>
      );
    }

    return null;
  }

  render() {
    const { loading, error } = this.props;
    return (
      <Fragment>
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
  fetchCotacaoRequest: PropTypes.func,
  loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  // listaCotacaoDia: PropTypes.checkPropTypes(PropTypes.array),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

HomePage.defaultProps = {
  fetchCotacaoRequest: null,
  loading: null,
  // listaCotacaoDia: [],
  error: null
};

const mapStateToProps = createStructuredSelector({
  listaCotacaoDia: selectors.selectorListaCotacaoDia(),
  // form: selectors.selectorForm(),
  loading: selectors.selectorLoading(),
  error: selectors.selectorError()
});

const mapDispatchToProps = dispatch => ({
  fetchCotacaoRequest: papel =>
    dispatch(BolsaAcoesActions.fetchCotacaoRequest(papel)),
  reset: () => dispatch(BolsaAcoesActions.resetRedux())
});

const HomePageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

export default withStyles(styles)(HomePageRedux);
