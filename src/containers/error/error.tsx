import { routes } from "@/static-data/routes";
import { Link } from "react-router";
import { Home, ArrowLeft, AlertTriangle, Search, MapPin } from "lucide-react";

export default function Error({
  resetErrorBoundry,
}: {
  resetErrorBoundry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto text-center relative z-10">
        {/* Error Icon and Number */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-400" />
          </div>
          <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4 animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-white/80 text-lg mb-6 leading-relaxed">
            Looks like you've ventured into the unknown digital realm. The page
            you're looking for seems to have vanished into the void.
          </p>

          {/* Helpful Suggestions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-4">
              <Search className="h-5 w-5 text-blue-400 mb-2" />
              <h3 className="text-white font-medium text-md mb-1">
                Double-check the URL
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-4">
              <MapPin className="h-5 w-5 text-emerald-400 mb-2" />
              <h3 className="text-white font-medium text-md mb-1">
                Navigate from Home
              </h3>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            to={routes.HOME}
            onClick={resetErrorBoundry}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/25 group"
          >
            <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Return to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Go Back
          </button>
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
