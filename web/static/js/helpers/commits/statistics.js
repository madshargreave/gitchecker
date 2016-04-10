export function groupByCommits (data) {
  let grouping;

  grouping = _.groupBy(data, entry => {
    return moment(entry.firstDayOfTheWeek).format('MM/DD');
  });
  grouping = _.mapValues(grouping, group => group[0].total);
  grouping = _.toPairs(grouping);

  return grouping;
}
