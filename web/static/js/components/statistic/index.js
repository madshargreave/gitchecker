import React, { Component, PropTypes } from 'react';

class Statistic extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { value, label } = this.props

    return (
      <div className="statistic">
        <div className="value">
          {value}
        </div>
        <div className="label">
          {label}
        </div>
      </div>
    )
  }
}

export default Statistic;


