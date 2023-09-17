import Profiles from "../components/profiles";

// false is default value
export default function Profile({ edit = false }: { edit?: boolean }) {
  return (
    <article className="grid min-h-screen place-content-center">
      <Profiles edit={edit} />
    </article>
  );
}
