import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DocumentTitle from 'react-document-title';
import PageLayout from '../components/layout/page_layout';

require('./about.scss');

class About extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    const { router } = this.props;

    return (
      <DocumentTitle title='GitChecker | About'>
        <PageLayout
          router={router}
          mainIconClass='github circle'>

          <div className="about-page">
            <div className="content ui two column middle aligned stackable divided grid">
                <h1 className="ui icon center aligned huge header main-header">
                  About
                </h1>
              <div className="row">
                <div className="column left">
                  <h2>
                    <span className="color italic">GitChecker</span> is an open source tool
                    which <span className="color">aggregates statistics</span> about Github projects.
                  </h2>
                </div>
                <div className="column right">
                  <h2>
                    Have you ever been stuck <span className="color">wondering</span> whether or not to use a <span className="color">library</span> or
                    a <span className="color">framework</span>, uncertain of how well it
                    was <span className="color">maintained</span>? Help is here<span className="color">!</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>

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

export default connect(select)(About);
