import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DocumentTitle from 'react-document-title';
import IssueStatisticsBox from '../components/report/issues';
import CommitStatisticsBox from '../components/report/commits';
import MetaStatisticsBox from '../components/report/meta';
import GeneralStatisticsBox from '../components/report/general';
import PageLayout from '../components/layout/page_layout';
import InputSection from '../components/input_section';

import Actions from '../actions';

require('./report.scss');

class Report extends Component {

  constructor (props) {
    super(props);

    const { dispatch }  = props;
    this._boundActions  = bindActionCreators(Actions, dispatch);
  }

  componentWillMount () {
    const { owner, repository } = this.props.params;

    if (owner && repository) {
      this._boundActions.fetchRepositoryStatistics({owner: owner, repository: repository});
    }
  }

  renderLastUpdatedTimeStamp () {
    const { lastUpdated } = this.props.project.meta;
    const string = moment(lastUpdated).fromNow();

    return (
      <div className='last-updated'>
        {string} <i className='time icon'></i>
      </div>
    );
  }

  renderStatistics () {
    const { project, issueStatisticBoxState, commitStatisticBoxState } = this.props;
    const { data, repository } = project;

    return (
      <div className='report-inner'>
        <MetaStatisticsBox
          data={repository}/>

        <IssueStatisticsBox
          state={issueStatisticBoxState}
          actions={this._boundActions}
          data={data.issues}/>

        <CommitStatisticsBox
          state={commitStatisticBoxState}
          actions={this._boundActions}
          data={data.commits}/>

        <GeneralStatisticsBox
          data={repository}/>
      </div>
    );
  }

  renderReport () {
    const { project } = this.props;
    const { data, repository } = project;

    if (_.isEmpty(data)) {
      return null;
    }

    return (
      <div className='report'>
        <div className='report-header'>
          <h3 className='title'>{repository.fullName}</h3>
          {this.renderLastUpdatedTimeStamp()}
        </div>

        {this.renderStatistics()}
      </div>
    );
  }

  render () {
    const { router, project, params } = this.props;
    const { owner, repository } = params;
    const title = `GitChecker - ${project.repository.fullName}`;

    return (
      <DocumentTitle title={title}>
        <PageLayout
          router={router}
          mainIconClass='circular search'
          mainIconText='GitChecker'>

          <InputSection
            owner={owner}
            repository={repository}
            actions={this._boundActions}
            project={project}/>

          {this.renderReport()}
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

export default connect(select)(Report);


