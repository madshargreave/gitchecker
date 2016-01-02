import React, { Component, PropTypes } from 'react';
import * as Statistics from '../../../helpers/issues/statistics';
import * as Metrics from '../../../helpers/issues/metrics';
import Chart from '../../../lib/charts';
import ReportGrouping from '../grouping';

require('./index.scss');

const OPEN_ISSUES = 'openIssues';
const CLOSED_ISSUES = 'closedIssues';
const TOTAL_ISSUES = 'totalIssues';
const OPEN_ISSUES_PERCENTAGE = 'openIssuesPercentage';
const AVG_RESOLUTION_TINE = 'avgResolutionTime';

class IssueStatisticsBox extends Component {

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

    actions.issueMetricChanged(index);
  }

  getActiveMetric () {
    const { activeMetricIndex } = this.props.state;
    const metric = this.getMetrics().find((metric, index) => index === activeMetricIndex);

    return metric;
  }

  getMetrics () {
    const { data } = this.props

    const totalOpened = Metrics.totalOpenedIssues(data);
    const totalClosed = Metrics.totalClosedIssues(data);

    const percentageOpened = Metrics.closedIssuePercentage(totalClosed, totalOpened);
    const meanResolutionTimeInDays = Metrics.meanResolutionTimeInDays(data);


    return [
      {
        id: OPEN_ISSUES,
        title: 'New Issues',
        value: totalOpened,
        chart: {
          type: 'number',
          label: 'New Issues'
        }
      },
      {
        id: CLOSED_ISSUES,
        title: 'Closed Issues',
        value: totalClosed,
        chart: {
          type: 'number',
          label: 'Closed Issues'
        }
      },
      {
        id: OPEN_ISSUES_PERCENTAGE,
        title: 'Closed Percentage',
        value: percentageOpened,
        chart: {
          type: 'number',
          label: '%'
        }
      },
      {
        id: AVG_RESOLUTION_TINE,
        title: 'Avg Resolution Time',
        value: meanResolutionTimeInDays,
        chart: {
          type: 'number',
          label: 'Days'
        }
      }
    ];
  }

  getData () {
    const { data } = this.props;
    const metric = this.getActiveMetric();

    let groupedData;
    switch (metric.id) {
      case OPEN_ISSUES:
        groupedData = Statistics.groupByOpenIssues(data)
        break;
      case CLOSED_ISSUES:
        groupedData = Statistics.groupByClosedIssues(data)
        break;
      case OPEN_ISSUES_PERCENTAGE:
        groupedData = Statistics.groupByClosedIssuePercentage(data)
        break;
      case AVG_RESOLUTION_TINE:
        groupedData = Statistics.groupByAverageResolutionTime(data)
        break;

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
          graphId='issue-graph'
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
      <ReportGrouping title='Issues' margin={false}>
        <div className="ui metrics">
          {this.renderMetrics()}
        </div>

        {this.renderChart()}
      </ReportGrouping>
    );
  }

}

export default IssueStatisticsBox;
