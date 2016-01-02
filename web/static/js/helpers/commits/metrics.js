export function totalCommits (data) {
  return data.reduce((acc, grouping) => {
    return acc + grouping.total;
  }, 0);
}
