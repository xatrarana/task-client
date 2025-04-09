
import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [userName, setuserName] = useState("")
  const [password, setPassword] = useState("")
  const { register, loading, error } = useAuth()
  const [userError, setUserError] = useState<string | null>(null)
  const navigate = useNavigate()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(' ')) {
      setUserError('Username cannot have spaces.');
    } else {
      setUserError('');
    }
    setuserName(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      await register(userName, password);

      alert("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 rounded-md shadow-sm">
            <div>
              <label htmlFor="userName" className="sr-only">
                Full userName
              </label>
              <input
                id="userName"
                name="username"
                type="text"
                autoComplete="userName"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="username"
                value={userName}
                onChange={handleChange}
              />
            </div>
            {userError && (
              <div className="rounded-md bg-red-50 p-2">
                <div className="text-sm text-red-700">{userError}</div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-2">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}


          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-300"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
