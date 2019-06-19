import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import LoadingBar from "react-redux-loading-bar";
//
import ScrollToTop from "./HOCs/ScrollToTop";
import WithTracker from "./HOCs/WithTracker";
import Loading from "./components/Loading";
import { ModalContainer } from "./containers/Modal";
//
import { establishCurrentUser } from "./services/auth/actions";
import { setNavigatorMetadata } from "./services/agent/actions";
import { isServer } from "./services/store";
//
import logToService from "./helpers/logToService";

const LoadableLanding = Loadable({
  loader: () => import("./screens/Landing"),
  loading: Loading,
  timeout: 10000
});

class App extends Component {
  componentWillMount() {
    if (!isServer) this.props.establishCurrentUser();
  }

  componentDidMount() {
    this.props.setNavigatorMetadata(window.navigator);
  }

  componentDidCatch(error, info) {
    logToService(error, info);
  }

  render() {
    return (
      <WithTracker>
        <ScrollToTop>
          <LoadingBar
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              zIndex: "100"
            }}
          />
          <ToastContainer
            closeButton={false}
            rtl
            bodyClassName="font-family-IRANSans"
            draggablePercent={40}
          />
          <Switch>
            <Route exact path="/" component={LoadableLanding} />
          </Switch>
          <ModalContainer />
        </ScrollToTop>
      </WithTracker>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default withRouter(
  connect(
    mapStateToProps,
    { establishCurrentUser, setNavigatorMetadata }
  )(App)
);
