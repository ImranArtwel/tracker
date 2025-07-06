// File: src/pages/Login.tsx
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

interface AuthFormInputs {
  email: string;
  password: string;
}

const provider = new GoogleAuthProvider();

export default function Login() {
  const { register, handleSubmit } = useForm<AuthFormInputs>();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: AuthFormInputs) => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Image Side */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url('/bg-expense.png')` }}
      />

      {/* Right - Form Side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-gray-100">
        <div className="bg-white bg-opacity-90 p-8 rounded shadow w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">
            {isSignup ? "Create an account" : "Sign in"}
          </h1>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="w-full border-2 border-black px-3 py-2 rounded text-black"
            />
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="w-full border-2 border-black px-3 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isSignup ? "Sign up" : "Sign in"}
            </button>
          </form>

          <div className="my-4 text-center text-gray-500 text-sm">or</div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Sign in with Google
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignup((prev) => !prev)}
              className="text-blue-600 text-sm hover:underline"
            >
              {isSignup
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
