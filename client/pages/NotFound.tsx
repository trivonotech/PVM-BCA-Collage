import { useNavigate } from "react-router-dom";
import { MoveLeft, HelpCircle, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B3B] font-poppins relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -ml-48 -mb-48 animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          {/* 404 Number with Gradient */}
          <div className="relative mb-8">
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-900/50 opacity-10">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 bg-blue-600/10 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl animate-bounce">
                <HelpCircle className="w-20 h-20 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Oops! You've drifted <br />
              <span className="text-blue-400">into unknown space.</span>
            </h2>
            <p className="text-blue-100/70 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              The page you're looking for was moved, renamed, or might never have existed in our college archives.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-[#0B0B3B] px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-blue-500/20 group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-900/40 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-blue-900/60 transition-all group"
            >
              <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Footer Note */}
          <p className="mt-16 text-blue-100/30 text-sm font-medium tracking-widest uppercase">
            PVM BCA College Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
