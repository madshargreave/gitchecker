import React, { Component, PropTypes } from 'react';
import ReportGrouping from '../grouping';

require('./index.scss');

class MetaStatisticsBox extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  getData () {
    const { data } = this.props;

    return [
      {
        title: 'Stars',
        value: data.starCount,
        class: "stars",
        iconClass: "star"
      },
      {
        title: 'Subscribers',
        value: data.subscriberCount,
        class: "subscribers",
        iconClass: "users"
      },
      {
        title: 'Forks',
        value: data.forkCount,
        class: "forks",
        iconClass: "fork"
      }
    ];
  }

  renderStatistics () {
    const elements = this.getData().map(entry => {
      let className = `ui tiny statistic ${entry.class}`;
      let iconClass = `${entry.iconClass} icon`;

      let e = (
        <div key={entry.title} className={className}>
          <div className="value">
            <i className={iconClass}></i>
            {entry.value}
          </div>
          <div className="label">
            {entry.title}
          </div>
        </div>
      );

      return e;
    });

    return elements;
  }

  render () {
    return (
      <ReportGrouping title='Statistics'>
        <div className='ui meta'>
          <div className="inner">
            {this.renderStatistics()}
          </div>
        </div>
      </ReportGrouping>
    );
  }

}

export default MetaStatisticsBox
