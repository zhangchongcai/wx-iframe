const tracks = {
  path: 'pages/film/index',
  elementTracks: [
    {
      element: '.playing-item',
      dataKeys: ['imgUrls', 'playingFilms[$INDEX].filmId', 'playingFilms[0]', 'test.name', '$APP.baseUrl', '$DATASET.test', '$INDEX'],
    }, {
      element: '.more',
      dataKeys: ['imgUrls', 'playingFilms', '$DATASET.test'],
    }
  ],
  methodTracks: [
    {
      method: 'getBanner',
      dataKeys: ['imgUrls'],
    }, {
      method: 'toBannerDetail',
      dataKeys: ['imgUrls'],
    }, {
      method: ['onShareAppMessage']
    }
  ],
};

export default tracks;
