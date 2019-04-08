import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Field, reduxForm } from 'redux-form';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { createValidator, required } from '../../Utils/validation';
import TextInputBase from '../Form/TextInputBase';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%'
  }
});

class EditTranslate extends Component {
  componentDidMount() {
    this.init();
  }

  init() {
    const { open, item, initialize } = this.props;
    if (open && item) {
      initialize({
        description: item.translate
      });
    }
  }

  render() {
    const {
      classes,
      open,
      item,
      handleCloseDialog,
      handleSubmit,
      onSubmit
    } = this.props;

    if (!open || !item) {
      return null;
    }
    return (
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">Edit word</DialogTitle>
        <DialogContent>
          <DialogContentText>For more details for the word</DialogContentText>
          <Typography variant="h4">Word: {item.origin}</Typography>
          <Field
            name="description"
            label="Description"
            className={classes.textField}
            required
            adornmentIcon="translate"
            component={TextInputBase}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditTranslate.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object,
  handleCloseDialog: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

EditTranslate.defaultProps = {
  item: null
};

const validate = createValidator({
  description: [required]
});

const reduxEditTranslate = reduxForm({ form: 'EditTranslate', validate })(
  EditTranslate
);

export default withStyles(styles)(reduxEditTranslate);
