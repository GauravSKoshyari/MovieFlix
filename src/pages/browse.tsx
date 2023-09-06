import React, { useEffect } from "react";
import { MovieResponse, MovieResult, fetchRequest } from "../common/api";
import { ENDPOINT } from "../common/endpoints";
import ContentRow from "../components/content-rows";

function Browse() {
  return (
    <section>
      <section>Banner Image</section>
      <ContentRow endpoint={ENDPOINT.MOVIES_POPULAR} title="Popular" />
      <ContentRow endpoint={ENDPOINT.MOVIES_TOP_RATED} title="Top Rated" />
      <ContentRow endpoint={ENDPOINT.MOVIES_NOW_PLAYING} title="Now Playing" />
    </section>
  );
}

export default Browse;
