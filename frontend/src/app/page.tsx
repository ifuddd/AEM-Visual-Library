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
          <div className="flex justify-center">
            <Link
              href="/catalog"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Browse Components
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
