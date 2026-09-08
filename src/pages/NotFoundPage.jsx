import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-[75vh] flex items-center justify-center px-4 py-16 text-center transition-colors duration-200">
      <div className="max-w-md bg-white dark:bg-stone-900 p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xs transition-colors duration-200">
        <span className="text-4xl">🌱</span>
        <h1 className="text-5xl font-black text-stone-900 dark:text-stone-50 mt-4 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mt-2 mb-2">Page Not Found</h2>
        <p className="text-stone-500 dark:text-stone-400 text-xs mb-8">
          The produce harvest or page you are seeking could not be found or has been relocated.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-xs font-bold transition shadow-md hover:shadow-lg"
        >
          Return to Marketplace &rarr;
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;