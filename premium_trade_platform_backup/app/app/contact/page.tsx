

import { ContactForm } from "@/components/contact/contact-form"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get in touch with our team for support, partnerships, or general inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  support@premiumtrade.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-yellow-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  London, United Kingdom
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-gray-700 dark:text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM GMT
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Support Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Technical Support
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Platform issues, account problems
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Business Inquiries
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Partnerships, enterprise solutions
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Verification
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Company verification process
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Billing
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Subscription and payment issues
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
