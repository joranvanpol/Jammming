const clientId = 'f4a6ebefcded49b993d299f7f868b1f7';
const redirectUri = 'http://7258jamming.surge.sh';

let accessToken;


const Spotify = {

  getAccessToken(){
    if (accessToken) {
      return accessToken;
    }
    const windowAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const windowExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (windowExpiresIn && windowAccessToken) {
      accessToken = windowAccessToken[1];
      let expiresIn = Number(windowAccessToken[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term) {
    let accessToken = Spotify.getAccessToken();
    let endPointUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    return fetch(`${endPointUrl}${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request Failed!');
    }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    let accessToken = Spotify.getAccessToken();
    let headers = { Authorization: `Bearer ${accessToken}`};
    let userId;
    let userIdUrl = 'https://api.spotify.com/v1/me';

    return fetch(userIdUrl, {
      headers: headers
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        header:headers,
        method:'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
    ).then(jsonResponse => {
      let playlistId = jsonResponse.id;
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers:headers,
        method: 'POST',
        body: JSON.stringify({uris: trackUris})
      });
    });
  });
  }

};

export default Spotify;
