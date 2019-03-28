import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardActions, Button, CircularProgress, Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import { Field, reduxForm } from 'redux-form';
// import classnames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// import red from '@material-ui/core/colors/red';
import { withStyles } from '@material-ui/core/styles';
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
  avatar: {
    // backgroundColor: red[500]
  }
});

class HomePage extends Component {
  componentWillMount() {
    // const { fetchCotacaoRequest, reset } = this.props;
    // fetchCotacaoRequest('ABEV3.SA');
    // reset();

    // const { initialize } = this.props;
    // // moment.to;
    // initialize({
    //   texto: 'It is easy to configure.'
    // });
  }

  
  onSubmit = (values) =>{
    const { onCompileTextWords, user } = this.props;
    
    onCompileTextWords({values, user});
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

  handleDoneText = (word)=>{
    const { onDoneTextWordsRequest, user } = this.props;
    onDoneTextWordsRequest({ word, user });    
  }

  renderCards() {
    const { classes, handleSubmit, loading, text } = this.props;
    const routerHome = Routes.find(r => r.order === 1);
    
      return (
        <div className={classes.root}>
          <TitlePage routerMain={routerHome} />
        <div style={{display: 'flex'}}>  
          <Card className={classes.card} style={{width: '50%'}}>
            <CardHeader title='Text for compiler' />
            <CardContent>
              <Field
                name="texto"
                label="Texto"
                className={classes.textField}
                required     
                multiline
                rowsMax="10"           
                adornmentIcon="textsms"
                component={TextInputBase}
              />              
            </CardContent> 
            <CardActions>
              <Button variant="contained" size="small" color="primary" onClick={handleSubmit(this.onSubmit)} disabled={loading}>
                Compilar
              </Button>   
              {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}          
            </CardActions>          
          </Card>
          <Card className={classes.card} style={{width: '50%'}}>
            <CardHeader title='Text' />
            <CardContent>
              {text}
            </CardContent> 
            
          </Card>
          </div>
        </div>
      );
    
  }

  renderWordsCard(){
    const { listWords, classes } = this.props;

    if(!listWords){
      return null;
    }
    if(listWords.length===0){
      return(
        <Card className={classes.card}>
          <CardContent>
            <Typography component="p">Congratulations you know all words, nice !!!</Typography>
          </CardContent> 
        </Card>
         );
    }

    const cards =listWords.map((w , index)=>
      <Card className={classes.card} key={index}>
      {/* <CardHeader title='teste' /> */}

      <CardContent>
        {w.origin} - {w.translate} 
      </CardContent> 
      <CardActions>
        <Tooltip title="Já aprendi">
            <IconButton color="primary" className={classes.button} aria-label="Add an alarm" onClick={()=>this.handleDoneText(w)}>
              <Icon>done</Icon>
            </IconButton>         
          </Tooltip>
        {/* <IconButton color="secondary" className={classes.button} aria-label="Add an alarm">
          <Icon>favorite_border</Icon>
        </IconButton>                          */}
      </CardActions>          
    </Card>
      );

    return (
      <div className={classes.root}  style={{ display: 'flex',flexWrap: 'wrap'}}>
         {cards}
        </div>
    );
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
        <ViewCards>{this.renderWordsCard()}</ViewCards>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  onCompileTextWords: PropTypes.func,
  loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  handleSubmit: PropTypes.func.isRequired,
  // listaCotacaoDia: PropTypes.checkPropTypes(PropTypes.array),
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  listWords: PropTypes.array,
  user: PropTypes.object,
  text: PropTypes.string,
};

HomePage.defaultProps = {
  onCompileTextWords: null,
  loading: null,
  // listaCotacaoDia: [],
  error: null,
  user:null
};

const mapStateToProps = createStructuredSelector({
  listWords: selectors.selectorListWords(),
  // form: selectors.selectorForm(),
  loading: selectors.selectorLoading(),
  error: selectors.selectorError(),
  user: selectorsSession.selectorSessionUser(),
  text: selectors.selectorText(),
});

const mapDispatchToProps = dispatch => ({  
  onCompileTextWords: papel =>
    dispatch(TextoActions.compileTextWordsRequest(papel)),
  onDoneTextWordsRequest: payload =>
    dispatch(TextoActions.doneTextWordsRequest(payload)),
  reset: () => dispatch(TextoActions.resetRedux())
});


const validate = createValidator({
  texto: [required],  
});

const reduxHomePage = reduxForm({ form: 'perfilEditPage', validate })(
  HomePage
);

const connectHomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxHomePage);

export default withStyles(styles)(connectHomePage);
