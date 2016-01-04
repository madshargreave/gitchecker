import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
require('./header.scss');

class Header extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  getMenuItems () {
    return {
      left: [
        {
          classes: 'header',
          route: '/',
          text: 'Home'
        },
        {
          classes: 'header',
          route: '/about',
          text: 'About'
        },
        {
          classes: 'header',
          route: 'https://github.com/madshargreave/gitchecker',
          text: 'GitHub',
          href: true,
        },
      ],
      right: [
      ]
    };
  }

  renderMenuItems (items) {
    return items.map(item => {
      let icon, { route, text, classes, href } = item;
      classes = `item ${classes}`;

      if (href) { return (<a
        key={route}
        href={route}
        target='_blank'
        className={classes}>{text}</a>)}

      return (
        <Link
          key={route}
          className={classes}
          to={route}>

          {text}
        </Link>
      );
    });
  }

  render () {
    const { router } = this.props;
    const { left, right } = this.getMenuItems();

    return (
      <div className="header-component">
        <div className="ui large secondary pointing menu">
          <div className="left menu">
            {this.renderMenuItems(left)}
          </div>

          <div className="right menu">
            {this.renderMenuItems(right)}
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
