import React, { Component, Suspense } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import T from 'prop-types';
import * as API from '../../services/Api';
import routes from '../../routes/routes';
import Loader from '../../components/Loader/Loader';
import style from './MovieDetailsPage.module.css';

class MovieDetailsPage extends Component {
  static propTypes = {
    match: T.shape({
      params: T.shape({
        movieId: T.string,
      }),
      url: T.string,
    }).isRequired,
    history: T.shape({
      goBack: T.func,
      push: T.func,
    }).isRequired,
    location: T.instanceOf(Object).isRequired,
  };

  state = {
    movie: { genres: [] },
    isLoading: false,
    isActiveC: false,
    isActiveR: false,
  };

  componentDidMount() {
    this.getMovies();
  }

  getMovies = () => {
    const { match } = this.props;
    const { movieId } = match.params;
    this.setState({ isLoading: true });

    API.getOneMovie(movieId)
      .then(res => this.setState({ movie: res.data }))
      .catch(err => {
        throw new Error(err);
      })
      .finally(() => {
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 1000);
      });
  };

  toggleMenuC = () => {
    const { isActiveC } = this.state;
    this.setState({
      isActiveC: !isActiveC,
    });
  };

  toggleMenuR = () => {
    const { isActiveR } = this.state;
    this.setState({
      isActiveR: !isActiveR,
    });
  };

  onBackButton = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { movie, isLoading, isActiveC, isActiveR } = this.state;
    const { match } = this.props;

    return (
      <>
        <div className={style.container_page}>
          {isLoading && <Loader />}
          <button
            type="button"
            onClick={this.onBackButton}
            className={style.button}
          >
            Back
          </button>
          <div className={style.container}>
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt=""
            />
            <div className={style.info}>
              <h2 className={style.movie_title}>
                {movie.original_title} ({movie.release_date})
              </h2>
              <p className={style.movie_score}>
                User score: {movie.vote_average * 10}%
              </p>
              <h3 className={style.movie_overview_title}>Overview</h3>

              <p className={style.movie_overview}>{movie.overview}</p>
              <h3 className={style.movie_genres_title}>Genres</h3>
              <p className={style.movie_genres}>
                {movie.genres.map(item => ` ${item.name} `)}
              </p>
            </div>
          </div>
        </div>
        <div className={style.container2}>
          <h3 className={style.info_title}>Additional information</h3>
          <Suspense>
            <NavLink
              replace
              onClick={this.toggleMenuC}
              className={style.cast}
              to={`${match.url}/cast`}
            >
              <span className={style.cast_narrow}></span> Cast
            </NavLink>
            <p />
            {isActiveC ? (
              <Route
                path={routes.CAST.path}
                component={routes.CAST.component}
              />
            ) : (
              ``
            )}
            <NavLink
              replace
              onClick={this.toggleMenuR}
              className={style.review}
              to={`${match.url}/reviews`}
            >
              <span className={style.cast_narrow}> </span>Reviews
            </NavLink>
            {isActiveR ? (
              <Route
                path={routes.REVIEWS.path}
                component={routes.REVIEWS.component}
              />
            ) : (
              ``
            )}
          </Suspense>
        </div>
      </>
    );
  }
}
export default MovieDetailsPage;
