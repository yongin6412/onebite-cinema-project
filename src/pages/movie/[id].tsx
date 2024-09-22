import style from "./[id].module.css";
import { fetchDetailMovie } from "@/lib/fetch-detail-movie";
import { fetchMovies } from "@/lib/fetch-movie";
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
} from "next";

export const getStaticPaths = async () => {
  const movies = await fetchMovies();
  return {
    paths: movies.map((movie) => ({
      params: {
        id: movie.id.toString(),
      },
    })),
    fallback: true,
  };
};

export const getStaticProps = async (context: GetServerSidePropsContext) => {
  const id = context.params!.id;
  const movieData = await fetchDetailMovie(Number(id));

  return {
    props: {
      movieData,
    },
  };
};

export default function MoviePage({
  movieData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!movieData) return "존재하지 않는 페이지입니다";

  return (
    <div className={style.movie_container}>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${movieData.posterImgUrl}')` }}
      >
        <img src={movieData.posterImgUrl} alt={`${movieData.title}`} />
      </div>

      <div className={style.info_container}>
        <h2 className={style.title}>{movieData.title}</h2>
        <div>
          {movieData.releaseDate} / {movieData.genres.join(", ")} /
          {movieData.runtime}분
        </div>
        <div>{movieData.company}</div>

        <div>
          <div className={style.subTitle}>{movieData.subTitle}</div>
          <div className={style.description}>{movieData.description}</div>
        </div>
      </div>
    </div>
  );
}
