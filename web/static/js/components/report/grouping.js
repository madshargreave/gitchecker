import React, { Component, PropTypes } from 'react';
// require('./index.scss');
//
class ReportGrouping extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    margin: PropTypes.bool.isRequired
  };

  static defaultProps = {
    margin: true
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { title, margin } = this.props;
    const className = margin ? 'group' : 'group no-margin'

    return (
      <div className="report-grouping">
        <h4 className='ui horizontal divider header'>{title}</h4>

        <div className={className}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default ReportGrouping;
