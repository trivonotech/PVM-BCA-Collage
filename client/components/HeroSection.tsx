export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-yellow-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Title with decorative star */}
            <div className="flex items-start gap-3 md:gap-4">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                viewBox="0 0 49 49"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.95 16.1286L38.9251 14.794L32.2097 25.9562L33.5467 38.9079L22.3645 32.2046L9.38944 33.5392L16.1048 22.377L14.7678 9.4253L25.95 16.1286Z"
                  fill="#FFD23F"
                />
                <path
                  d="M38.9507 14.7709L25.8732 16.5649L14.7934 9.40221L19.1368 22.7328L24.4568 23.7543L28.042 29.383L32.3527 25.5713L38.9507 14.7709Z"
                  fill="#FFE572"
                />
              </svg>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-grotesk">
                Education That Builds Capable Professionals
              </h1>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-gray-800 max-w-lg leading-relaxed">
              Undergraduate programs in Business Administration and Science designed to develop practical skills, analytical thinking, and career readiness.
            </p>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-yellow-300 rounded-full font-medium text-sm md:text-base hover:bg-gray-800 transition-colors group">
              Start Your Journey
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 8 15"
                fill="none"
              >
                <path
                  d="M0.894531 14.2996C0.793251 14.3026 0.692069 14.2847 0.597656 14.2468C0.503399 14.209 0.41757 14.1521 0.344727 14.0798C0.27181 14.0075 0.213576 13.9205 0.172852 13.825C0.132189 13.7295 0.109253 13.6265 0.106445 13.5222C0.103696 13.418 0.120811 13.3141 0.15625 13.2166C0.191679 13.1191 0.245834 13.0302 0.314453 12.9539L0.313476 12.9529L5.48437 7.20386L0.314452 1.45483L0.264647 1.39526C0.21774 1.33324 0.17989 1.26383 0.152343 1.19019C0.115724 1.09218 0.0984489 0.987588 0.100585 0.882569C0.102764 0.777456 0.12434 0.673287 0.165038 0.576905C0.205828 0.480422 0.265298 0.393037 0.338866 0.320069C0.412429 0.247125 0.499405 0.189857 0.594725 0.1521C0.69 0.1144 0.791537 0.0965453 0.893553 0.100342C0.995677 0.104153 1.096 0.12982 1.18848 0.174561C1.28071 0.21922 1.36338 0.282162 1.43164 0.360108L1.43164 0.361084L7.09277 6.65601C7.22662 6.80471 7.2998 7.00103 7.2998 7.20386C7.2998 7.40669 7.22663 7.603 7.09277 7.75171L1.43066 14.0476C1.3619 14.124 1.2795 14.186 1.1875 14.2292C1.09541 14.2726 0.995742 14.2965 0.894531 14.2996Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {/* Latest News Card */}
            <div className="mt-8 md:mt-12 p-4 md:p-6 border border-pink-200 rounded-2xl bg-white/50 backdrop-blur-sm max-w-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-pink-900">📰</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Latest News</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s
                  </p>
                  <a href="#" className="text-sm font-semibold text-pink-600 mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
                    More Detail →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="relative h-80 md:h-96 lg:h-auto flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F0868c041cabc4c51bfcb6cb29f5ae749%2F76b70e87d45e4bcdb594f04a97c922a9?format=webp&width=800"
              alt="Student character illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
