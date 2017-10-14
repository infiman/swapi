import React from 'react';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Menu from 'grommet/components/Menu';
import Search from 'grommet/components/Search';
import Spinning from 'grommet/components/icons/Spinning';

import './index.scss';

const DELAY = 333;

class SearchHeader extends React.Component {
  constructor(...args) {
    super(...args);

    this.private = {
      throttleTimeout: -1,
    };

    this.onHeaderSearch = this.onHeaderSearch.bind(this);
  }

  onHeaderSearch(e) {
    window.clearTimeout(this.private.throttleTimeout);

    this.private.throttleTimeout = window.setTimeout(() => this.search(e.target.value), DELAY);
  }

  setCurrentResourceType(type) {
    if (!type) return;

    this.props.onTypeUpdate({ type });
  }

  getCurrentResourceType() {
    const { types, type } = this.props.data;

    return type || types[0] || '';
  }

  get menu() {
    const { types, fetching, error } = this.props.data;

    return (
      <Menu
        inline={false}
        dropAlign={{
          right: 'right',
          top: 'top',
        }}
        icon={fetching ? <Spinning /> : null}
      >
        {
          error ?
            <Heading
              uppercase
              margin="none"
              strong
              tag="h4"
            >
              {error}
            </Heading> :
            types.map(
              type => (
                <Anchor
                  key={type}
                  className="swapi-menu-item"
                  align="end"
                  reverse
                  label={type}
                  onClick={
                    () => this.setCurrentResourceType(type)
                  }
                >
                  <Heading
                    uppercase
                    margin="none"
                    strong
                    tag="h4"
                  >
                    {type}
                  </Heading>
                </Anchor>
              ),
            )
        }
      </Menu>
    );
  }

  search(query) {
    const type = this.getCurrentResourceType();

    if (!type) return;

    this.props.onQueryUpdate({ query: query || ' ' });
  }

  componentWillUmount() {
    window.clearTimeout(this.private.throttleTimeout);
  }

  render() {
    return (
      <Header className="swapi-search-header">
        <Anchor
          align="end"
          reverse
          path={{ path: '/', index: true }}
        >
          <Heading
            tag="h2"
            margin="none"
            uppercase
            strong
          >
            SWAPI
          </Heading>
        </Anchor>
        <Search
          fill
          inline
          dropAlign={{
            right: 'right',
            top: 'top',
          }}
          placeHolder={`Embrace the world of Star Wars! Search for ${this.getCurrentResourceType()}...`}
          onDOMChange={this.onHeaderSearch}
        />
        {this.menu}
      </Header>
    );
  }
}

export default SearchHeader;
