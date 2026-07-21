import { useState, type FormEvent } from "react";

import { useAuthStore } from "../stores/authStore";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    if (isRegister) {
      await register({
        email,
        password,
        name: name.trim() || undefined,
      });

      return;
    }

    await login({
      email,
      password,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <form
        onSubmit={(event) => void submit(event)}
        className="w-full max-w-md rounded-2xl bg-slate-800 p-6 text-white shadow-xl"
      >
        <h1 className="mb-6 text-3xl font-bold">
          {isRegister ? "Register" : "Login"}
        </h1>

        {isRegister && (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="mb-3 w-full rounded-lg bg-slate-700 px-3 py-2"
          />
        )}

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="mb-3 w-full rounded-lg bg-slate-700 px-3 py-2"
        />

        <input
          type="password"
          required
          minLength={8}
          maxLength={72}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="mb-3 w-full rounded-lg bg-slate-700 px-3 py-2"
        />

        {error && <p className="mb-3 text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-violet-700 px-4 py-2 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : isRegister ? "Create account" : "Login"}
        </button>

        <button
          type="button"
          onClick={() => {
            clearError();
            setIsRegister((current) => !current);
          }}
          className="mt-4 w-full text-violet-300"
        >
          {isRegister ? "Already have an account?" : "Create new account"}
        </button>
      </form>
    </main>
  );
};

export default AuthPage;
