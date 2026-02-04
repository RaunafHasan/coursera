export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#056f80]">
              E-Learning Platform
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering learners worldwide with high-quality educational content. 
              Learn at your own pace with our comprehensive courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-[#7dd3e0] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-[#7dd3e0] transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="/admin" className="text-gray-300 hover:text-[#7dd3e0] transition-colors">
                  Admin Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Developer</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="font-semibold text-white">Naeem</p>
              <p>Department of Computer Science and Engineering</p>
              <p>University of Barisal</p>
              <p className="mt-3">
                <a href="tel:01623094662" className="hover:text-[#7dd3e0] transition-colors">
                  01623094662
                </a>
              </p>
              <p>
                <a href="mailto:naeem.cse7.bu@gmail.com" className="hover:text-[#7dd3e0] transition-colors">
                  naeem.cse7.bu@gmail.com
                </a>
              </p>
              <p>
                <a 
                  href="https://www.facebook.com/AreFin1Naeem" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#7dd3e0] transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} E-Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
