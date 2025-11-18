import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            AEM Visual Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Visual component library for Adobe Experience Manager with Azure DevOps Wiki integration
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Components
            </Link>
            <Link
              href="/contribute"
              className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Contribute
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Visual-First</h3>
              <p className="text-gray-600">
                Browse components with thumbnails, screenshots, and Figma designs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Developer Docs</h3>
              <p className="text-gray-600">
                Direct integration with Azure DevOps Wiki for implementation details
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2">Collaborative</h3>
              <p className="text-gray-600">
                Designers and developers can contribute and review together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
