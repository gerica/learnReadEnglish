/* eslint-disable linebreak-style */
import { Home, AccountCircle } from '@material-ui/icons';
import HomePage from '../Containers/Home';
import LoginPage from '../Containers/Login';
import PerfilPage from '../Containers/Perfil';
import { ROUTER_HOME, ROUTER_LOGIN, ROUTER_PERFIL } from './constants';

const Routes = [
  {
    order: 1,
    path: ROUTER_HOME,
    sidebarName: 'Home',
    navbarName: 'Home',
    icon: Home,
    component: HomePage,
    selected: false
  },
  {
    order: 2,
    path: ROUTER_PERFIL,
    sidebarName: 'Perfil',
    navbarName: 'Perfil',
    icon: AccountCircle,
    component: PerfilPage,
    selected: false
  },
  {
    order: 99,
    path: ROUTER_LOGIN,
    sidebarName: 'Login',
    navbarName: 'Login',
    icon: AccountCircle,
    component: LoginPage,
    selected: false
  }
];

export default Routes;
