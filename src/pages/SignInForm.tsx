import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
// import { Link } from 'react-router-dom'
import Button from './Button'
import InputField from '../components/InputField'

export default function SignInForm2() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateLogin = (login: string): boolean => {
    // const loginRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // if (!login) {
    //   setLoginError('Login is required')
    //   return false
    // }
    // if (!loginRegex.test(login)) {
    //   setLoginError('Please enter a valid login address')
    //   return false
    // }
    if (!login) {
      setLoginError('Login is required')
      return false
    }
    if (login.length < 4) {
      setLoginError('Login must be at least 4 characters long')
      return false
    }
    setLoginError('')
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 4) {
      setPasswordError('Password must be at least 4 characters long')
      return false
    }
    if (password.length > 12) {
      setPasswordError('Password must not exceed 12 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogin = e.target.value
    setLogin(newLogin)
    if (newLogin) {
      validateLogin(newLogin)
    } else {
      setLoginError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    if (newPassword) {
      validatePassword(newPassword)
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const isLoginValid = validateLogin(login)
    const isPasswordValid = validatePassword(password)

    if (!isLoginValid || !isPasswordValid) {
      return
    }

    // Handle sign in logic here
    // console.log({ login, password, rememberMe })
  }

  return (
    <div className="w-full  max-w-md space-y-8 rounded-lg bg-white dark:bg-gray-800 p-8 shadow-sm transition-colors duration-200">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Sign in</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your login to sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <InputField
            label="Login"
            type="login"
            value={login}
            onChange={handleLoginChange}
            onBlur={() => validateLogin(login)}
            placeholder="Enter your login"
            error={loginError}
            required
          />

          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              placeholder="Enter your password (4-12 characters)"
              error={passwordError}
              required
              minLength={4}
              maxLength={12}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Remember me</span>
          </label>

          <button type="button" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Forgot password?
          </button>
        </div> */}

        <Button type="submit" fullWidth>
          Sign in
        </Button>

        {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Register
          </Link>
        </p> */}
      </form>
    </div>
  )
}