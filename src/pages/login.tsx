import { useEffect } from "react";
import netflixLogo from "../assets/Netflix_Logo_RGB.png";
import { useAuth } from "../common/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // if there are some changes to user and user is there , navigate to profile page
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function authenticateUser(event: React.SyntheticEvent) {
    //  NOTE:  React uses synthetic events to abstract away the differences between different browsers' native event implementations and provide a consistent interface for handling events across all supported browsers.

    event.preventDefault(); //prevents the default behavior of the form submission. By calling preventDefault(), it stops the browser from performing its default action, which in this case would be to submit the form and refresh the page.

    // performs type assertion to specify the types of the email and password fields. It ensures that the types are correctly inferred for TypeScript
    const { email, password } = event.target as typeof event.target & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

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
          className="relative mx-auto  w-[350px] rounded-r-lg bg-black/75 p-16 "
        >
          <article className="text-gray-300 ">
            <h1 className="mb-4 text-4xl text-white">Sign In</h1>
            <section className="flex flex-col gap-4">
              <input
                className="rounded-md bg-zinc-500 p-2 outline-none"
                type="email"
                name="email"
                id="email"
                placeholder="Enter username"
              />
              <input
                className="rounded-md bg-zinc-500 p-2 outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
              />
              <button className="my-8 rounded-md bg-netflixRed p-2 font-semibold text-white outline-none">
                Sign In
              </button>
            </section>
            <p>
              New to Netflix?{" "}
              <Link className="text-white" to="/signup">
                Sign up now
              </Link>
            </p>
          </article>
        </form>
      </main>
    </>
  );
}
