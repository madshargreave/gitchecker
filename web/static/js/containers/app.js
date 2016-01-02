import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Actions from '../actions';

import DocumentTitle from 'react-document-title';
import Recent from '../components/recent';
import InputSection from '../components/input_section';
import PageLayout from '../components/layout/page_layout';

require('./app.scss');

class App extends Component {

  constructor (props) {
    super(props);

    const { dispatch }  = props;
    this._boundActions  = bindActionCreators(Actions, dispatch);
  }

  componentWillMount () {
    const { owner, repository } = this.props.params;
    this._boundActions.fetchRecentRepositories();
  }

  renderRecentSection () {
    const { isFetchingRecent, recent } = this.props.project;
    const { params } = this.props;

    if (!_.isEmpty(params)) { return null; }

    return (
      <Recent showLoadingIndicator={isFetchingRecent} projects={recent}/>
    );
  }

  render () {
    const { router, project } = this.props;

    return (
      <DocumentTitle title='GitChecker | Home'>
        <PageLayout router={router}>
          <InputSection
            actions={this._boundActions}
            project={project}
            mainIconClass='circular search'
            mainIconText='GitChecker'/>

          {this.renderRecentSection()}
        </PageLayout>
      </DocumentTitle>
    )
  }
}

function select (state) {
  return {
    router: state.router,
    ...state
  };
}

export default connect(select)(App);
