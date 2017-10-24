import React, { Component } from 'react';
// import logo from './logo.svg';
import './Playlist.css';
import TrackList from '../TrackList/TrackList'


class Playlist extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
  <input onChange={this.props.handleNameChange} defaultValue={this.props.playlistName}/>
  <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} />
  <a onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</a>
</div>
    );
  }
}

export default Playlist;
