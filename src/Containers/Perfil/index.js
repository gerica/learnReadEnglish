import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import ListaPalavrasPage from './list';
import FlashCardPage from './flashCard';

import * as selectorsSession from '../../Stores/Session/selector';
import TextoActions from '../../Stores/Texto/actions';
import * as selectors from '../../Stores/Texto/selector';
import { ROUTER_HOME } from '../../Utils/constants';

import { createValidator, required, phone } from '../../Utils/validation';
import CustomizedSnackbars from '../../Components/Snackbars/CustomizedSnackbars';
import TitlePage from '../../Components/AppBar/TitlePage';
import Routes from '../../Utils/routes';
import CustomizedProgress from '../../Components/Progress/CustomizedProgress';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.paper
    // marginTop: theme.spacing.unit * 3
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

class PerfilPage extends React.Component {
  state = {
    value: 0,
    stateMessage: null
  };

  shouldComponentUpdate(nextProps) {
    const { message, onResetRedux } = nextProps;

    if (message) {
      this.setState({ stateMessage: message });
      onResetRedux();
    }
    return true;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  onHandleChangeMessage = () => {
    this.setState({ stateMessage: null });
  };

  renderInfoUser() {
    const { classes, user } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Informações do usuário:
          </Typography>

          <Typography component="p">Nome: {user.displayName}</Typography>
          <Typography component="p">E-mail: {user.email}</Typography>
        </CardContent>
      </Card>
    );
  }

  render() {
    const { classes, user, error, loading } = this.props;
    const { value, stateMessage } = this.state;
    const routerPerfil = Routes.find(r => r.order === 2);
    if (!user) {
      return <Redirect to={ROUTER_HOME} />;
    }

    return (
      <div className={classes.root}>
        {loading ? <CustomizedProgress /> : null}
        <TitlePage routerMain={routerPerfil} />
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
        <AppBar
          position="static"
          style={{ marginLeft: 5, marginRight: 5, width: '99.2%' }}
        >
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Info" />
            <Tab label="Lista" />
            <Tab label="FlasCards" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>{this.renderInfoUser()}</TabContainer>}
        {value === 1 && (
          <TabContainer>
            <ListaPalavrasPage />
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            <FlashCardPage />
          </TabContainer>
        )}
      </div>
    );
  }
}

PerfilPage.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  onResetRedux: PropTypes.func.isRequired,
  message: PropTypes.string,
  loading: PropTypes.bool
};

PerfilPage.defaultProps = {
  message: null
};

const mapStateToProps = createStructuredSelector({
  user: selectorsSession.selectorSessionUser(),
  message: selectors.selectorMessage(),
  loading: selectors.selectorLoading()
});

const mapDispatchToProps = dispatch => ({
  onResetRedux: () => dispatch(TextoActions.resetRedux())
});

const validate = createValidator({
  contato: [required, phone]
});

const reduxFormPerfilEdit = reduxForm({ form: 'perfilEditPage', validate })(
  PerfilPage
);
const PerfilPageRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxFormPerfilEdit);

export default withStyles(styles, { withTheme: true })(PerfilPageRedux);
