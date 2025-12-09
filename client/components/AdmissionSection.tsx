export default function AdmissionSection() {
  const steps = [
    {
      number: '01',
      title: 'apply online',
      description: 'Submit your application through our online portal with all required documents.',
    },
    {
      number: '02',
      title: 'Verify Documents',
      description: 'Our team will review and verify all your submitted documents.',
    },
    {
      number: '03',
      title: 'Confirm Admission',
      description: 'Complete your admission process and join our academic community.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-12 md:space-y-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-grotesk">
              Your Admission Journey
            </h2>

            {/* Steps */}
            <div className="space-y-8 md:space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-800 text-white font-bold text-sm md:text-base">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-purple-900 mb-2">
                      {step.number} {step.title}
                    </h3>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-yellow-300 text-gray-900 rounded-full font-semibold hover:bg-yellow-400 transition-colors text-sm md:text-base">
              Apply Now →
            </button>
          </div>

          {/* Right Side - Illustration Placeholder */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-purple-900 font-semibold">Admission Process Visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
