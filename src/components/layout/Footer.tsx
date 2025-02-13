export default function Footer() {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} [[REPLACE: Your Company Name]]. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }