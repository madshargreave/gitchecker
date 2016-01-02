import * as ActionTypes from '../constants/action_types';

let initialState = {
  isFetchingRepository: false,
  isFetchingRecent: false,
  hasError: false,
  errorMessage: null,

  meta: {},
  data: {},
  repository: {},
  recent: []
};

const statisticsReducer = function (state = initialState, action) {
  switch (action.type) {

    case ActionTypes.INVALID_GITHUB_URL_ENTERED:
      return Object.assign({}, state, {
        hasError: true,
        errorMessage: action.errorMessage
      });

    case ActionTypes.FETCH_REPOSITORY_STATISTICS_REQUEST:
      return Object.assign({}, state, {
        isFetchingRepository: true,
        hasError: false,
        errorMessage: null
      });

    case ActionTypes.FETCH_REPOSITORY_STATISTICS_SUCCESS:
      const { project, data } = action.data;
      const updatedAt = new Date(project.updatedAt)

      return Object.assign({}, state, {
        isFetchingRepository: false,
        hasError: false,
        errorMessage: null,

        meta: {
          lastUpdated: updatedAt
        },
        repository: {
          fullName: project.fullName,
          createdAt: project.createdAt,
          description: project.description,
          forkCount: project.forkCount,
          language: project.language,
          ownerLogin: project.ownerLogin,
          ownerType: project.ownerType,
          pushedAt: project.pushedAt,
          size: project.size,
          starCount: project.starCount,
          subscriberCount: project.subscriberCount
        },
        data: {
          issues: data.issues,
          commits: data.commits
        }
      });

    case ActionTypes.FETCH_REPOSITORY_STATISTICS_FAILURE:
      return Object.assign({}, state, {
        isFetchingRepository: false,
        hasError: true,
        errorMessage: action.errorMessage
      });

    case ActionTypes.FETCH_RECENT_REPOSITORIES_REQUEST:
      return Object.assign({}, state, {
        isFetchingRecent: true
      });

    case ActionTypes.FETCH_RECENT_REPOSITORIES_SUCCESS:
      return Object.assign({}, state, {
        isFetchingRecent: false,
        recent: action.data
      });

    case ActionTypes.FETCH_RECENT_REPOSITORIES_FAILURE:
      return Object.assign({}, state, {
        isFetchingRecent: false
      });

    default:
      return state;
  }
}

export default statisticsReducer;
