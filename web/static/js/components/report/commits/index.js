import React, { Component, PropTypes } from 'react';
import * as Statistics from '../../../helpers/commits/statistics';
import * as Metrics from '../../../helpers/commits/metrics';
import Chart from '../../../lib/charts';
import ReportGrouping from '../grouping';

const COMMITS = 'commits';
const CONTRIBUTIONS = 'constributions';

// require('./index.scss');

class CommitStatisticsBox extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired
  };

  constructor (props) {
    super(props);

    this.handleMetricClick = this.handleMetricClick.bind(this);
  }

  handleMetricClick (metric) {
    const { actions } = this.props;
    const index = this.getMetrics().findIndex(entry => entry.title === metric.title );

    actions.commitMetricChanged(index);
  }

  getActiveMetric () {
    const { activeMetricIndex } = this.props.state;
    const metric = this.getMetrics().find((metric, index) => index === activeMetricIndex);

    return metric;
  }

  getMetrics () {
    const { data } = this.props

    const totalCommits = Metrics.totalCommits(data);

    return [
      {
        id: COMMITS,
        title: 'Total Commits',
        value: totalCommits,
        chart: {
          type: 'number',
          label: 'New Commits'
        }
      },
      // {
      //   id: CONTRIBUTIONS,
      //   title: 'Contributions',
      //   value: 'adsa',
      //   chart: {
      //     type: 'number',
      //     label: 'New Contributions'
      //   }
      // }
    ];
  }

  getData () {
    const { data } = this.props;
    const metric = this.getActiveMetric();

    let groupedData;
    switch (metric.id) {
      case COMMITS:
        groupedData = Statistics.groupByCommits(data)
        break;
      // case CONTRIBUTIONS:
      //   groupedData = Statistics.groupByOpenIssues(data)
      //   break;

      default:
        break;
    }

    return groupedData;
  }

  renderMetrics () {
    const { state } = this.props;
    const { activeMetricIndex } = state;

    const jsx = this.getMetrics()
      .map((metric, index) => {
        let active = index === activeMetricIndex ? 'active' : '';
        let className = `ui label statistic-label ${active}`;

        let element = (
          <div className={className} key={metric.title} onClick={this.handleMetricClick.bind(null, metric)}>
            {metric.title}
            <div className='detail'>{metric.value}</div>
          </div>
        );

        return element;
      });

    return jsx;
  }

  renderChart () {
    const { data } = this.props;
    const shouldShow = data && data.length > 1; // First element is headers

    if (!shouldShow) { return null; }

    const groupedData = this.getData();
    const { title, chart } = this.getActiveMetric();

    const options = {
      title: title,
      backgroundColor: 'f7f7f7',
      series: { 0: { color: '3b83c0' }},
      // curveType: 'function',
      // legend: { position: 'bottom' },
      legend: 'none'
      // titlePosition: 'none'
    };

    const columns = [{ type: 'string', label: 'Week' }];
    columns.push(chart);

    return (
      <div className="chart-container">
        <Chart
          graphId='commits-graph'
          type="LineChart"
          columns={columns}
          data={groupedData}
          options={options}
          width='100%'
          height='100%'/>
      </div>
    );
  }

  render () {
    return (
      <ReportGrouping title='Commits' margin={false}>
        <div className="ui grid stackable column issues metrics">
          {this.renderMetrics()}
        </div>
        {this.renderChart()}
      </ReportGrouping>
    );
  }

}

export default CommitStatisticsBox
