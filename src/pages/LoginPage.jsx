import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      const msg = err?.data?.message || err?.error || 'Please enter the right account';
      setErrorMessage(msg);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  const displayedError = errorMessage || error?.data?.message || (error?.error ? String(error.error) : null);

  return (
    <div className="bg-[#FDFBF7] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xs border border-stone-200/80">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
            Welcome Back
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-3">
            Sign In to Organi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your organic orders, favorite harvests, and rapid checkout.
          </p>
        </div>

        {/* Error / Invalid Account Notification */}
        {displayedError && (
          <div
            id="login-error-alert"
            role="alert"
            className="bg-red-50 border border-red-200/80 text-red-800 px-4 py-3.5 rounded-2xl mb-6 flex items-start gap-3 shadow-xs animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-red-900">Authentication Failed</p>
              <p className="text-red-700 mt-0.5">{displayedError}</p>
            </div>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="e.g. user@organi.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full pl-10 pr-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full pl-10 pr-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? 'Checking Account...' : 'Sign In to Account'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Demo Credentials for Convenience */}
        <div className="mt-6 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs">
          <p className="font-bold text-stone-700 mb-2">Demo Accounts in Database:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@organi.com', 'password123')}
              className="px-2.5 py-1 bg-white border border-stone-200 hover:border-green-500 hover:text-green-700 rounded-lg font-medium text-[11px] text-stone-600 transition"
            >
              Demo Admin (admin@organi.com)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('user@organi.com', 'password123')}
              className="px-2.5 py-1 bg-white border border-stone-200 hover:border-green-500 hover:text-green-700 rounded-lg font-medium text-[11px] text-stone-600 transition"
            >
              Demo User (user@organi.com)
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center text-stone-500 text-xs">
          New to Organi?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-green-700 hover:text-green-800 font-bold ml-1 hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;