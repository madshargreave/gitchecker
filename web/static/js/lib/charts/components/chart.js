  import React, { Component, PropTypes } from 'react';
import GoogleChartLoader from '../lib/loader';

var uniqueId = 0;

var generateUniqueId = function() {
  uniqueId++;
  return 'reactgooglegraph' + Math.random();
};

class Chart extends Component {

  static propTypes = {
    graphId: PropTypes.string,
    type: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.array).isRequired,
    options: PropTypes.object,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    graphId: generateUniqueId(),
    isLoading: false
  };

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const self = this;

    GoogleChartLoader.init().then(() => {
      self.drawChart();
    });

    window.addEventListener('resize', (event) => this.drawChart());
  }

  componentWillUnmount () {
    window.removeEventListener('resize', (event) => this.drawChart());
  }

  componentDidUpdate () {
    if (GoogleChartLoader.is_loaded){
      this.drawChart();
    };
  }

  drawChart () {
    const { type, graphId, options, data, columns } = this.props;

    const emptyDataTable = new google.visualization.DataTable();
    const wrapper = new google.visualization.ChartWrapper({
      chartType: type,
      options: options,
      containerId: graphId
    });

    const dataTable = new google.visualization.DataTable();
    columns.forEach(column => dataTable.addColumn(column.type, column.label));
    dataTable.addRows(data)

    wrapper.setDataTable(dataTable);

    wrapper.draw();
  }

  renderLoadingIndicator () {
    const { isLoading } = this.props;

    if (!isLoading) { return null; }

    return (
      <div className='ui active large inline loader'></div>
    )
  }

  render () {
    const { graphId, width, height } = this.props;
    const style = {width, height}

    return <div id={graphId} style={style}>{this.renderLoadingIndicator()}</div>;
  }

}

export default Chart
