import axios from 'axios';
import { replaceState } from 'redux-router';
import * as ActionTypes from '../constants/action_types';

export function invalidGithubUrlEntered () {
  const errorMessage = 'Invalid GitHub URL or project name';
  return { type: ActionTypes.INVALID_GITHUB_URL_ENTERED, errorMessage };
}

export function fetchRepositoryStatisticsRequest () {
  return { type: ActionTypes.FETCH_REPOSITORY_STATISTICS_REQUEST };
}

export function fetchRepositoryStatisticsSuccess (data) {
  return { type: ActionTypes.FETCH_REPOSITORY_STATISTICS_SUCCESS, data };
}

export function fetchRepositoryStatisticsFailure (errorMessage) {
  return { type: ActionTypes.FETCH_REPOSITORY_STATISTICS_FAILURE, errorMessage };
}

export function fetchRecentRepositoriesRequest () {
  return { type: ActionTypes.FETCH_RECENT_REPOSITORIES_REQUEST };
}

export function fetchRecentRepositoriesSuccess (data) {
  return { type: ActionTypes.FETCH_RECENT_REPOSITORIES_SUCCESS, data };
}

export function fetchRecentRepositoriesFailure (errorMessage) {
  return { type: ActionTypes.FETCH_RECENT_REPOSITORIES_FAILURE, errorMessage };
}

export function fetchRepositoryStatistics (params, callback) {
  return dispatch => {
    dispatch(fetchRepositoryStatisticsRequest());

    const { owner, repository } = params;
    const url = `/api/projects/${owner}/${repository}`;

    axios.get(url)
      .then(response => {
        const { project } = response.data;
        const { owner, repository } = project;
        const redirect = `/${owner}/${repository}`;

        dispatch(fetchRepositoryStatisticsSuccess(response.data));
        if (callback !== undefined) {
          callback(redirect);
        }
      })
      .catch(response => {
        const { message } = response.data;
        dispatch(fetchRepositoryStatisticsFailure(message))
      });
  }
}

export function fetchRecentRepositories () {
  return dispatch => {
    dispatch(fetchRecentRepositoriesRequest());

    axios.get('/api/projects/recent')
      .then(response => {
        dispatch(fetchRecentRepositoriesSuccess(response.data));
      })
      .catch(response => {
        dispatch(fetchRecentRepositoriesFailure(response))
      });
  }
}
