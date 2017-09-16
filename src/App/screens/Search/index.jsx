import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { searchSwapi } from '../../../ducks/searchResults';

import SearchPane from './components/SearchPane';
import Section from '../../../common/components/Section';
import Tiles from '../../../common/components/Tiles';
import Meter from '../../../common/components/Meter';
import Box from '../../../common/components/Box';
import Value from '../../../common/components/Value';
import Headline from '../../../common/components/Headline';
import ListPlaceholder from '../../../common/components/ListPlaceholder';

class Search extends React.Component {
  componentWillMount() {
    this.props.searchSwapi();
  }

  componentWillReceiveProps(nextProps) {
    const { type, query } = this.props.search;

    if (nextProps.search.type !== type || nextProps.search.query !== query) {
      this.props.searchSwapi();
    }
  }

  get searchTiles() {
    const { type } = this.props.search;
    const { results } = this.props.searchResults;

    return (
      <Tiles fill>
        {
          results.map(
            item => <SearchPane key={item.url} type={type} data={item} />,
          )
        }
      </Tiles>
    );
  }

  get placeHolder() {
    const { type, query } = this.props.search;
    const { fetching } = this.props.searchResults;

    return fetching ?
      <ListPlaceholder /> :
      <Headline align="center">
        {`Cannot find "${query}" in ${type} collection. :(`}
      </Headline>;
  }

  get meter() {
    const { type } = this.props.search;
    const { results, count } = this.props.searchResults;

    return count ? (
      <Box align="center">
        <Meter value={(results.length * 100) / count} />
        <Value
          value={results.length}
          units={type}
          align="center"
        />
      </Box>
    ) :
      null;
  }

  render() {
    const { count } = this.props.searchResults;

    return (
      <Section>
        <Box align="center">
          {
            count
              ? this.searchTiles
              : this.placeHolder
          }
        </Box>
        {this.meter}
      </Section>
    );
  }
}

Search.propTypes = {
  search: PropTypes.shape({
    type: PropTypes.string,
    query: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    fetching: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  searchResults: PropTypes.shape({
    fetching: PropTypes.bool,
    error: PropTypes.string,
    count: PropTypes.number,
    next: PropTypes.string,
    previous: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  searchSwapi: PropTypes.func.isRequired,
};

function mapStateToProps({ searchResults, search }) {
  return {
    search,
    searchResults,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchSwapi: payload => dispatch(searchSwapi(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);