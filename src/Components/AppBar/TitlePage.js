import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import MyTheme from '../../muiTheme';

const styles = theme => ({
  paper: {
    margin: theme.spacing.unit * 0.5,
    overflowX: 'auto'
  },
  divCenter: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center'
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  iconCrumb: {
    margin: theme.spacing.unit * 0.5
  },
  title: {
    fontSize: 25,
    // fontWeight: 'bold',
    color: MyTheme.palette.success,
    opacity: '0.5'
  },
  link: {
    fontSize: 12,
    // fontWeight: 'bold',
    color: MyTheme.palette.primary.light
    // opacity: '0.5'
  }
});

class TitlePage extends Component {
  state = {};

  render() {
    const { classes, routerMain, routerList } = this.props;

    let links;
    if (routerList && routerList.length > 0) {
      links = routerList.map(r => (
        <Fragment key={r.order}>
          <Link to={r.path} className={classes.divCenter}>
            <r.icon className={classes.iconCrumb} color="action" />
            <Typography component="span" className={classes.link}>
              {r.navbarName}
            </Typography>
          </Link>
          <Typography component="span" className={classes.link}>
            &nbsp;/
          </Typography>
        </Fragment>
      ));
    }

    return (
      <Fragment>
        <div className={classes.divCenter}>
          <routerMain.icon
            className={classes.icon}
            color="action"
            style={{ fontSize: 30 }}
          />
          <Typography component="p" className={classes.title}>
            {routerMain.navbarName}
          </Typography>
        </div>
        <Paper className={classes.paper}>
          <div className={classes.divCenter}>
            {links}
            <routerMain.icon className={classes.iconCrumb} color="action" />
            <Typography component="span" className={classes.link}>
              {routerMain.navbarName}
            </Typography>
          </div>
        </Paper>
      </Fragment>
    );
  }
}

TitlePage.propTypes = {
  classes: PropTypes.object.isRequired,
  routerMain: PropTypes.object.isRequired,
  routerList: PropTypes.array
};

TitlePage.defaultProps = {
  routerList: []
};

export default withStyles(styles, { withTheme: true })(TitlePage);
