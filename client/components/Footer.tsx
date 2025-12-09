export default function Footer() {
  return (
    <footer className="bg-gray-900 text-blue-300 pt-12 md:pt-20 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Logo and Address */}
          <div className="space-y-6 col-span-2 md:col-span-1 lg:col-span-1">
            <div>
              <span className="text-2xl font-bold text-white">logo</span>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Address</h4>
              <p className="text-sm leading-relaxed">
                Lorem ipsum is simply dummy text of the printing and typesetting industry
              </p>
            </div>

            {/* Apply Button */}
            <button className="w-full px-4 py-3 border border-gray-700 rounded-full text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition-colors">
              Admissions Open — Apply Now
            </button>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4 md:mb-6 text-base md:text-lg">
              Quick Links
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm">
              {['Home', 'About', 'Academics', 'Admission', 'Campus', 'Placement', 'Updates'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-span-1">
            <h4 className="font-bold text-white mb-4 md:mb-6 text-base md:text-lg">
              Contact Us
            </h4>
            <ul className="space-y-2 md:space-y-3 text-sm">
              <li>
                <a href="tel:1234567890" className="hover:text-white transition-colors">
                  1234567890
                </a>
              </li>
              <li>
                <a href="mailto:college@gmail.com" className="hover:text-white transition-colors">
                  college@gmail.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Location
                </a>
              </li>
            </ul>
          </div>

          {/* Follow On */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-bold text-white mb-4 md:mb-6 text-base md:text-lg">
              Follow On
            </h4>
            <div className="flex gap-4">
              {['f', 'in', 'tw', 'ig'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center text-sm text-blue-400">
            <p>
              © 2024 Educational Institute. All rights reserved. | Privacy Policy | Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
