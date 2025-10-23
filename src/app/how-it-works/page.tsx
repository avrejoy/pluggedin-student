import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-navy-600 mb-4">
            How PluggedIn Works
          </h1>
          <p className="text-xl text-navy-500">
            Connect with student entrepreneurs in three simple steps
          </p>
        </div>

        {/* For Students Looking for Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-navy-600 mb-8 text-center">
            For Students
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-navy-600 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  Browse Businesses
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Explore student-run businesses across categories like tutoring, food, beauty, creative services, and more. Use filters and search to find exactly what you need.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-navy-600 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  Check Reviews & Portfolios
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Read reviews from other students and view portfolio posts to see the quality of work. Make informed decisions based on real experiences from your peers.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-navy-600 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  Connect & Support
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Reach out directly via email, phone, or Instagram. Support your classmates by choosing their businesses over corporate alternatives. Leave a review after your experience!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Business Owners */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-navy-600 mb-8 text-center">
            For Business Owners
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-brown-500 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  Create Your Account
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Sign up with your UIC email address. It's free and takes less than a minute. You'll need to verify your email to get started.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-brown-500 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  List Your Business
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Add your business details, upload a profile picture, and share what makes your services unique. Include your contact info and social media so students can reach you easily.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start bg-cream-50 p-6 rounded-2xl border-2 border-brown-200">
              <div className="flex-shrink-0 w-12 h-12 bg-brown-500 text-cream-50 rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-navy-600 mb-2">
                  Showcase Your Work
                </h3>
                <p className="text-navy-500 leading-relaxed">
                  Add portfolio posts with images of your products or services. Update your profile regularly to keep customers engaged. Respond to reviews and build your reputation!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 bg-cream-50 rounded-2xl p-8 border-2 border-brown-200">
          <h2 className="text-3xl font-serif text-navy-600 mb-6 text-center">
            Platform Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">100% Free</h4>
                <p className="text-navy-500 text-sm">No fees, no commissions. Keep everything you earn.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🎓</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">UIC Students Only</h4>
                <p className="text-navy-500 text-sm">Exclusive community for verified UIC students.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">⭐</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">Reviews & Ratings</h4>
                <p className="text-navy-500 text-sm">Build trust through authentic student feedback.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">📸</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">Portfolio Showcase</h4>
                <p className="text-navy-500 text-sm">Display your best work with photos and descriptions.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">Easy Discovery</h4>
                <p className="text-navy-500 text-sm">Advanced search and category filters to find services.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <h4 className="font-semibold text-navy-600 mb-1">Mobile Friendly</h4>
                <p className="text-navy-500 text-sm">Access PluggedIn anywhere, anytime on any device.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-navy-600 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-cream-50 p-6 rounded-xl border-2 border-brown-200">
              <h4 className="font-semibold text-navy-600 mb-2">Is PluggedIn really free?</h4>
              <p className="text-navy-500">Yes! There are no fees for listing your business or using the platform. We're built by students, for students.</p>
            </div>

            <div className="bg-cream-50 p-6 rounded-xl border-2 border-brown-200">
              <h4 className="font-semibold text-navy-600 mb-2">Do I need a registered business?</h4>
              <p className="text-navy-500">No! Whether you're just starting out or already established, all UIC student entrepreneurs are welcome.</p>
            </div>

            <div className="bg-cream-50 p-6 rounded-xl border-2 border-brown-200">
              <h4 className="font-semibold text-navy-600 mb-2">How do payments work?</h4>
              <p className="text-navy-500">Students contact you directly and arrange payment however you prefer. We don't handle any transactions.</p>
            </div>

            <div className="bg-cream-50 p-6 rounded-xl border-2 border-brown-200">
              <h4 className="font-semibold text-navy-600 mb-2">Can I edit my business profile later?</h4>
              <p className="text-navy-500">Absolutely! You can edit your business information, add new portfolio posts, and update your details anytime from your dashboard.</p>
            </div>

            <div className="bg-cream-50 p-6 rounded-xl border-2 border-brown-200">
              <h4 className="font-semibold text-navy-600 mb-2">What if I have a problem or question?</h4>
              <p className="text-navy-500">Reach out to us anytime at support@pluggedin.com. We're here to help!</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-navy-600 text-cream-50 rounded-2xl p-12">
          <h2 className="text-3xl font-serif mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Join the UIC student business community today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="px-8 py-3 bg-cream-50 text-navy-600 rounded-lg font-semibold hover:bg-cream-100 transition-colors"
            >
              Browse Businesses
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 border-2 border-cream-50 text-cream-50 rounded-lg font-semibold hover:bg-cream-50 hover:text-navy-600 transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}