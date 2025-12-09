export default function StatsSection() {
  const stats = [
    {
      number: '10000+',
      label: 'Students shown faith in us',
    },
    {
      number: '50',
      label: 'Events',
    },
    {
      number: '15+',
      label: 'Experience',
    },
    {
      number: '10+',
      label: 'Courses Offered',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 right-16 w-32 h-32 border border-red-400 rounded-2xl opacity-50" />
        <div className="absolute bottom-8 left-20 w-24 h-24 border-2 border-red-400 rounded-full opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-200 mb-2">
                {stat.number}
              </div>
              <p className="text-sm md:text-base text-pink-100 leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
