import React, { Component, PropTypes } from 'react';
import gitHubUrlParse from 'github-url-parse';

class InputSection extends Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  static propTypes = {
    project: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    owner: PropTypes.string,
    repository: PropTypes.string
  };

  constructor (props) {
    super(props);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmit   = this.handleSubmit.bind(this);
  }

  parseUserAndRepository (string) {
    let github = gitHubUrlParse(string);

    if (!!github) {
       let { user, repo } = github;
       return { user, repo };
    }

    const match = string.split('/');
    if (match.length === 2) {
      let [ user, repo ] = match;
      return { user, repo };
    }

    return false;
  }

  handleKeyPress (event) {
    if (event.which !== 13) { return; }
    this.handleSubmit(event);
  }

  handleSubmit (event) {
    const { actions } = this.props;
    const { history } = this.context;

    const repositoryUrl = this.refs.repositoryUrl.value;
    const match = this.parseUserAndRepository(repositoryUrl);

    if (!match) {
      return actions.invalidGithubUrlEntered();
    }

    const { user, repo } = match;
    actions.fetchRepositoryStatistics({ owner: user, repository: repo }, (redirect) => {
      history.pushState({}, redirect);
    });
  }

  renderActionSection () {
    const { project } = this.props;
    const { isFetchingRepository } = project;

    let buttonClass = 'ui aligned center huge middle submit primary button';
    if (isFetchingRepository) { buttonClass = `${buttonClass} loading`}

    return (
      <div className="action">
        <button className={buttonClass} onClick={this.handleSubmit} disabled={isFetchingRepository}>
          Check!
        </button>
      </div>
    );
  }

  renderInput () {
    const { owner, repository, project } = this.props;
    const { hasError, errorMessage } = project;
    const fullName = `${owner}/${repository}`;
    const defaultValue = (owner && repository) ? fullName : '';

    let classes = 'ui left huge fluid input';
    let formClass = 'ui form';

    if (hasError) {
      classes = `${classes} error`;
      formClass = `${formClass} error`;
    }

    return (
      <div className="">
        <div className="info">Paste a GitHub repository URL, or the repository ("user/repository")</div>
        <div className={classes}>
          <input
            ref='repositoryUrl'
            className='field'
            type="text"
            onKeyPress={this.handleKeyPress}
            defaultValue={defaultValue}/>

        </div>
        {hasError ? <p className='error'>* {errorMessage}</p> : null}
      </div>
    );
  }

  render () {
    return (
      <div className="input-section">
        {this.renderInput()}
        {this.renderActionSection()}
      </div>
    );
  }
}

export default InputSection;
