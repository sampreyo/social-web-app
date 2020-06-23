import React,{useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {checklogin} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
const PrivateRoute = ({ component: Component, ...rest }) =>{ 
  const auth=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch(checklogin());
  });
  return(
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);
  }




export default PrivateRoute;
