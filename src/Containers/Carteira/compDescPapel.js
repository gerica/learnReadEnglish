import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText
} from '@material-ui/core';
import moment from 'moment';

import { createValidator, required } from '../../Utils/validation';

const styles = theme => {
  // console.log({ theme });
  return {
    root: {
      width: 400
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: '95%'
    },
    divAlignEnd: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    },
    buttonDelete: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.common.white
    }
  };
};

class CompDescPapel extends Component {
  state = {
    openConfirm: false
  };

  componentWillMount() {
    const { initialize } = this.props;
    // moment.to;
    initialize({
      dataOperacao: moment(new Date()).format('YYYY-MM-DD')
    });
  }

  handleOpen = () => {
    this.setState({ openConfirm: true });
  };

  handleClose = () => {
    this.setState({ openConfirm: false });
  };

  renderConfirmation() {
    const { openConfirm } = this.state;
    const { classes, papel, onDelete, loading } = this.props;

    return (
      <Dialog
        open={openConfirm}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Confirmar a exclusão do papel
        </DialogTitle>
        <DialogContent className={classes.root}>
          <DialogContentText>
            O papel: {papel.papel} será excluido
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Fechar
          </Button>
          <Button
            onClick={() => {
              this.handleClose();
              onDelete();
            }}
            className={classes.buttonDelete}
            disabled={loading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { classes, papel, open, handleClose, loading } = this.props;

    if (!papel) {
      return null;
    }

    return (
      <Fragment>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Papel:{papel.papel}</DialogTitle>
          <DialogContent className={classes.root}>
            <DialogContentText>
              Data: {moment(papel.dataOperacao).format('DD/MM/YYYY')}
            </DialogContentText>
            <DialogContentText>Preço: {papel.preco}</DialogContentText>
            <DialogContentText>
              Quantidade: {papel.quantidade}
            </DialogContentText>
            <DialogContentText>Despesa: {papel.despesa}</DialogContentText>
            <DialogContentText>
              Observação: {papel.observacao}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Fechar
            </Button>
            <Button
              onClick={this.handleOpen}
              className={classes.buttonDelete}
              // style={MyTheme.palette.danger}
              disabled={loading}
            >
              Apagar
            </Button>
          </DialogActions>
        </Dialog>
        {this.renderConfirmation()}
      </Fragment>
    );
  }
}

CompDescPapel.propTypes = {
  classes: PropTypes.object.isRequired,
  papel: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  open: PropTypes.bool,
  loading: PropTypes.bool
};

CompDescPapel.defaultProps = {
  open: false,
  loading: false,
  papel: null
};

const validate = createValidator({
  data: [required],
  papel: [required],
  operacao: [required],
  preco: [required],
  quantidade: [required],
  despesa: [required]
});

const reduxCompDescPapel = reduxForm({ form: 'perfilEditPage', validate })(
  CompDescPapel
);

export default withStyles(styles, { withTheme: true })(reduxCompDescPapel);
