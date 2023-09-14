import { ENDPOINT } from "../common/endpoints";
import ContentRow from "../components/content-rows";
import Banner from "../components/Banner";

function Browse() {
  return (
    <section className="absolute top-0 w-full">
      <Banner />
      <ContentRow endpoint={ENDPOINT.MOVIES_POPULAR} title="Popular" />
      <ContentRow endpoint={ENDPOINT.MOVIES_TOP_RATED} title="Top Rated" />
      <ContentRow endpoint={ENDPOINT.MOVIES_NOW_PLAYING} title="Now Playing" />
    </section>
  );
}

export default Browse;
