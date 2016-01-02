export function totalOpenedIssues (data) {
  return data.reduce((acc, grouping) => {
    if (!grouping.issues) { return; }
    return acc + grouping.issues.length;
  }, 0);
}

export function totalClosedIssues (data) {
  return data.reduce((acc, grouping) => {
    if (!grouping.issues) { return; }

    let issues = grouping.issues.filter(entry => entry.state == 'closed');
    return acc + issues.length;
  }, 0);
}

export function totalIssues (data) {
  return data.reduce((acc, group) => {
    return group.issues.length;
  });
}

export function closedIssuePercentage (closed, total) {
  if (!total) { return 'N/A'; }

  const ratio = closed / total;
  const percentage = mathjs.round(ratio * 100, 2);
  const string = `${percentage} %`
  return string;
}

export function meanResolutionTimeInDays (data) {
  let count = 0;
  let sum = 0;

  data.forEach(grouping => {
    let issues = grouping.issues.filter(entry => entry.state == 'closed');
    if (issues.length === 0) { return; }

    let result = issues.reduce((acc, issue) => {
      count += 1;

      let diff, { createdAt, closedAt } = issue;
      createdAt = moment(createdAt);
      closedAt = moment(closedAt);
      diff = closedAt.diff(createdAt, 'days');

      return acc + diff;
    }, 0);

    sum += result;
  }, 0);

  if (!sum) { return 'N/A'; }

  const average = mathjs.round(sum / count, 2);
  const string = `${average} days`
  return string;
}
