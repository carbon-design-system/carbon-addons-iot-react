import React from 'react';

class SearchBar extends React.Component {
  state = { term: '' };
  onInputChange = event => {
    console.log(event.target.value);
  };
  onFormSubmit = event => {
    event.preventDefault();
  };
  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <label>Search List</label>
          <input
            type="text"
            value={this.state.term}
            onChange={e => this.setState({ term: e.target.value })}
          />
        </form>
      </div>
    );
  }
}

export default SearchBar;
