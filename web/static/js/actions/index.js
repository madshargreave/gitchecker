import * as IssueActions from './issues';
import * as CommitActions from './commits';
import * as RepositoryActions from './repository';

const Actions = Object.assign(IssueActions, RepositoryActions, CommitActions);

export default Actions
