const simulateNotFound = {
  movieSessionsByCinema: false,
  movieSessionsByCity: false,
  moviesByCinema: false,
  moviesByCity: false
};

const simulateError = {
  movieSessionsByCinema: false,
  movieSessionsByCity: false,
  moviesByCinema: false,
  moviesByCity: false
};

const getMovieSessionByCinemaId = (movieId, cinemaId) => {
  if (simulateError.movieSessionsByCinema) throw new Error('Error fetching movie sessions by cinema ID');
  if (simulateNotFound.movieSessionsByCinema) return null;
  return [{ session: 'Session 1', cinemaId, movieId }, { session: 'Session 2', cinemaId, movieId }];
};

const getMovieSessionByCityId = (movieId, cityId) => {
  if (simulateError.movieSessionsByCity) throw new Error('Error fetching movie sessions by city ID');
  if (simulateNotFound.movieSessionsByCity) return null;
  return [{ session: 'Session A', cityId, movieId }, { session: 'Session B', cityId, movieId }];
};

const getMoviesByCinemaId = (cinemaId) => {
  if (simulateError.moviesByCinema) throw new Error('Error fetching movies by cinema ID');
  if (simulateNotFound.moviesByCinema) return null;
  return [{ title: 'Movie 1', cinemaId }, { title: 'Movie 2', cinemaId }];
};

const getMoviesByCityId = (cityId) => {
  if (simulateError.moviesByCity) throw new Error('Error fetching movies by city ID');
  if (simulateNotFound.moviesByCity) return null;
  return [{ title: 'Movie A', cityId }, { title: 'Movie B', cityId }];
};

module.exports = {
  getMovieSessionByCinemaId,
  getMovieSessionByCityId,
  getMoviesByCinemaId,
  getMoviesByCityId,
  simulateNotFound,
  simulateError
};
