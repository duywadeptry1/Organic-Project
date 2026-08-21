import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md bg-white p-10 rounded-3xl border border-stone-200/80 shadow-xs">
        <span className="text-4xl">🌱</span>
        <h1 className="text-5xl font-black text-stone-900 mt-4 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-stone-800 mt-2 mb-2">Page Not Found</h2>
        <p className="text-stone-500 text-xs mb-8">
          The produce harvest or page you are seeking could not be found or has been relocated.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-2xl text-xs font-bold hover:bg-green-700 transition shadow-md"
        >
          Return to Marketplace &rarr;
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;