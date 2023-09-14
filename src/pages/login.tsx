import netflixLogo from "../assets/Netflix_Logo_RGB.png";
import { useAuth } from "../common/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  async function authenticateUser(event: React.SyntheticEvent) {
    // todos : React.SyntheticEvent

    // todos : next line
    const { email, password } = event.target as typeof event.target & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };
    event.preventDefault();
    const user = await signIn(email.value, password.value);
    if (user) {
      navigate("/");
    }
  }

  return (
    <>
      <header className="relative z-[1] w-56">
        <img src={netflixLogo} alt="Netflix logo" className="h-full w-full" />
      </header>
      <main>
        <section
          className={`absolute top-0 -z-[1] min-h-screen w-full bg-[url("/netflix-cover.jpg")] bg-cover`}
        ></section>
        <section className="absolute inset-0 bg-gradient-to-b from-zinc-900/50"></section>
        <form
          onSubmit={authenticateUser}
          className="relative mx-auto min-h-[70vh] w-[450px] rounded-r-lg bg-black/75 p-16 "
        >
          <article>
            <h1 className="mb-4 text-4xl">Sign In</h1>
            <section className="flex flex-col gap-4">
              <input
                className="rounded-md bg-zinc-500 p-2 text-gray-300"
                type="email"
                name="email"
                id="email"
              />
              <input
                className="rounded-md bg-zinc-500 p-2 text-gray-300"
                type="password"
                name="password"
                id="password"
              />
              <button className="bg-netflixRed my-8 rounded-md p-2 font-semibold">
                Sign In
              </button>
            </section>
            <p>New to Netflix? Sign up now.</p>
          </article>
        </form>
      </main>
    </>
  );
}
