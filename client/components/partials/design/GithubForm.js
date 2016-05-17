import React from 'react';

export default class GithubForm extends React.Component {
  static propTypes = {
    repoName: React.PropTypes.object.isRequired,
    privacy: React.PropTypes.object.isRequired,
    description: React.PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount = () => {
    const { privacy } = this.props;
    privacy.onChange(false);
  }

  handleClick = (event) => {
    const { privacy } = this.props;
    if (event.target.checked) { privacy.onChange(true); } else {
      privacy.onChange(false);
    }
  }

  render() {
    const { description } = this.props;
    return (
      <div className="githubForm">
        <img src="../../../githubLogo.png" />
        <div>
          <div className="serverLabel">Repo Description</div>
          <div>
            {description.touched && description.error && <div className="error">{description.error}</div>}
            <textarea
              cols="25" rows="4" name="description" placeholder="a description" {...description}
            />
          </div>
          <div className="serverLabel"><input type="checkbox" onClick={this.handleClick} />Make repo private?</div>
        </div>
      </div>
    )
  }
}

export default GithubForm;
