/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import moment from 'moment';

import { createValidator, required } from '../../Utils/validation';
import DatePickerBase from '../../Components/Form/DatePickerBase';
import TextInputBase from '../../Components/Form/TextInputBase';

// const itensSN = [
//   { label: 'Entrada', value: 'entrada' },
//   { label: 'Saída', value: 'saida' }
// ];

const styles = theme => ({
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
  }
});

class CompNovoPapel extends Component {
  state = {};

  componentWillMount() {
    const { initialize } = this.props;
    // moment.to;
    initialize({
      dataOperacao: moment(new Date()).format('YYYY-MM-DD')
    });
  }

  render() {
    const { classes, onSubmit, open, handleClose, loading } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Novo Papel</DialogTitle>
        <DialogContent className={classes.root}>
          {/* <DialogContentText>Nome:</DialogContentText> */}
          <Field
            name="dataOperacao"
            label="Data"
            required
            adornment
            className={classes.textField}
            component={DatePickerBase}
          />

          <Field
            name="papel"
            label="Papel"
            className={classes.textField}
            required
            adornmentIcon="add_box"
            component={TextInputBase}
          />
          {/* <Field
            id="operacao"
            required
            className={classes.textField}
            name="operacao"
            label="Selecione a operação"
            options={itensSN}
            component={SelectBase}
            onCustomChange={this.onChangeTipo}
          /> */}
          <Field
            name="preco"
            label="Preço"
            className={classes.textField}
            required
            adornmentIcon="attach_money"
            component={TextInputBase}
          />
          <Field
            name="quantidade"
            label="Quantidade"
            className={classes.textField}
            required
            adornmentIcon="equalizer"
            component={TextInputBase}
          />
          <Field
            name="despesa"
            label="Despesa"
            className={classes.textField}
            required
            adornmentIcon="attach_money"
            component={TextInputBase}
          />
          <Field
            name="observacao"
            label="Observação"
            adornmentIcon="speaker_notes"
            className={classes.textField}
            component={TextInputBase}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
          <Button onClick={onSubmit} color="primary" disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CompNovoPapel.propTypes = {
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  loading: PropTypes.bool
};

CompNovoPapel.defaultProps = {
  open: false,
  loading: false
};

const validate = createValidator({
  data: [required],
  papel: [required],
  operacao: [required],
  preco: [required],
  quantidade: [required],
  despesa: [required]
});

const reduxCompNovoPapel = reduxForm({ form: 'perfilEditPage', validate })(
  CompNovoPapel
);

export default withStyles(styles, { withTheme: true })(reduxCompNovoPapel);
