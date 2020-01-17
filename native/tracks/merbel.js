const tracks = {
    path: 'pages/member/index',
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
        method: 'getUserInfo',
        dataKeys: ['userInfo'],
      }
    ],
  };
  
  export default tracks;
  