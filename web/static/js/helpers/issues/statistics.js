import * as Metrics from './metrics';

export function groupByOpenIssues (data) {
  let grouping;

  grouping = _.groupBy(data, entry => moment(entry.firstDayOfTheWeek).format('MM/DD'));
  grouping = _.mapValues(grouping, group => {
    let data = group[0].issues;
    if (data.length === 0) { return 0; }

    return data.length;
  });
  grouping = _.pairs(grouping);

  return grouping;
}

export function groupByClosedIssues (data) {
  let grouping;

  grouping = _.groupBy(data, entry => moment(entry.firstDayOfTheWeek).format('MM/DD'));
  grouping = _.mapValues(grouping, group => {
    let data = group[0].issues;
    if (data.length === 0) { return 0; }

    data = data.filter(entry => entry.state == 'closed');
    return data.length;
  });
  grouping = _.pairs(grouping);

  return grouping;
}

export function groupByClosedIssuePercentage (data) {
  let grouping;

  grouping = _.groupBy(data, entry => moment(entry.firstDayOfTheWeek).format('MM/DD'));
  grouping = _.mapValues(grouping, group => {
    let issues = group[0].issues;
    if (issues.length === 0) { return 100; }

    let open = issues.filter(entry => entry.state == 'open').length;
    let closed = issues.filter(entry => entry.state == 'closed').length;

    let ratio = closed / (open + closed);
    let percentage = mathjs.round(ratio * 100, 2);
    return percentage;
  });
  grouping = _.pairs(grouping);

  return grouping;
}

export function groupByAverageResolutionTime (data, total) {
  let grouping, count, diff, createdAt, closedAt, issues, closed, average, sum;

  grouping = _.groupBy(data, entry => moment(entry.firstDayOfTheWeek).format('MM/DD'));
  grouping = _.mapValues(grouping, group => {
    issues = group[0].issues;
    count = 0;

    closed = issues.filter(entry => entry.state == 'closed');
    if (closed.length === 0) { return; }

    sum = closed.reduce((acc, issue) => {
      count += 1;

      let diff, { createdAt, closedAt } = issue;
      createdAt = moment(createdAt);
      closedAt = moment(closedAt);
      diff = closedAt.diff(createdAt, 'days');

      return acc + diff;
    }, 0);

    average = mathjs.round(sum / count, 2);
    return average;
  });
  grouping = _.pairs(grouping);

  return grouping;
}
