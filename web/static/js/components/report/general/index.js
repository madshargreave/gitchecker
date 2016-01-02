import React, { Component, PropTypes } from 'react';
import ReportGrouping from '../grouping';

require('./index.scss');

class GeneralStatisticsBox extends Component {

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
        title: 'Owner',
        value: data.ownerLogin,
        iconClass: 'user'
      },
      {
        title: 'Type',
        value: data.ownerType,
        iconClass: 'tag'
      },
      {
        title: 'Created',
        value: (() => { return moment(data.createdAt).fromNow(); })(),
        iconClass: 'calendar outline'
      },
      {
        title: 'Language',
        value: data.language,
        iconClass: 'code'
      },
      {
        title: 'Size',
        value: data.size,
        iconClass: 'circle'
      }
    ];
  }

  renderGeneralData () {
    const elements = this.getData().map(entry => {
      let { title, className, iconClass, value } = entry;
      iconClass = `${iconClass} large middle aligned icon`

      let e = (
        <div key={title} className='item'>
          <i className={iconClass}></i>
          <div className="content">
            <div className="header">{title}</div>
            <div className="description">{value}</div>
          </div>
        </div>
      );

      return e;
    });

    return elements;
  }

  render () {
    return (
      <ReportGrouping title='General'>
        <div className='ui general'>
          <div className="inner">
            <div className="ui relaxed list">
              {this.renderGeneralData()}
            </div>
          </div>
        </div>
      </ReportGrouping>
    );
  }

}

export default GeneralStatisticsBox
