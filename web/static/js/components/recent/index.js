import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
require('./index.scss');

class Recent extends Component {

  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    showLoadingIndicator: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);
  }

  renderProjects () {
    const { projects } = this.props;

    const elements = projects.map(project => {
      let { owner, name, updatedAt } = project;

      let fullName = `${owner}/${name}`;
      let time = moment(updatedAt).fromNow();
      let url = `/${fullName}`;

      return (
        <div key={fullName} className="project item">
          <i className="large github middle aligned icon"></i>
          <div className="content">
              <Link to={url}><div className="header">{fullName}</div></Link>
              <div className="description">{time}</div>
          </div>
        </div>
      );
    });

    return (
      <div className="ui relaxed divided list">
        {elements}
      </div>
    );
  }

  renderLoadingIndicator () {
    return (
      <div className="loading-container">
        <div className="ui active centered medium inline loader"></div>
      </div>
    );
  }

  render () {
    const { showLoadingIndicator } = this.props;

    return (
      <div className='recent'>
        <h3 className="ui header">Recently Analyzed</h3>
        {showLoadingIndicator ? this.renderLoadingIndicator() : this.renderProjects()}
      </div>
    )
  }
}

export default Recent;


