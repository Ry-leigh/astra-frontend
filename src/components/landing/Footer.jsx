import React from "react"

const Footer = () => {
  return (
    <footer className="bg-white py-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-medium text-slate-900">
                  Work inquires:
                </span>
                <a
                  href="mailto:work@vaultflow.com"
                  className="hover:text-violet-600"
                >
                  work@vaultflow.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-slate-900">
                  PR and speaking:
                </span>
                <a
                  href="mailto:press@vaultflow.com"
                  className="hover:text-violet-600"
                >
                  press@vaultflow.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-slate-900">
                  New business:
                </span>
                <a
                  href="mailto:newbusiness@vaultflow.com"
                  className="hover:text-violet-600"
                >
                  newbusiness@vaultflow.com
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-6">
              Developers
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Developed by 3rd year BSIS students of LVCC
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            © 2023 Astra. All rights reserved
          </p>

          <div className="flex items-center gap-4 mt-4 md:mt-0 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0 opacity-50">
            <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
            <span className="text-sm font-semibold">Astra</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
