import type { Component } from '@aem-portal/shared';

interface AuthoringTabProps {
  component: Component;
}

export function AuthoringTab({ component }: AuthoringTabProps) {
  const hasDialogSchema = component.aemMetadata?.dialogSchema;
  const hasLimitations = component.aemMetadata?.limitations && component.aemMetadata.limitations.length > 0;

  return (
    <div className="space-y-6">
      {/* Dialog schema */}
      {hasDialogSchema ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Author Dialog Schema</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              {JSON.stringify(component.aemMetadata!.dialogSchema, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No dialog schema available
        </div>
      )}

      {/* Editable fields info */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Authoring Information</h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">For Content Authors</p>
              <p>
                This component can be authored in AEM's component dialog. Editable
                fields are defined in the dialog schema above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Limitations */}
      {hasLimitations && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Limitations & Constraints</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-2">
              {component.aemMetadata!.limitations!.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Allowed children */}
      {component.aemMetadata?.allowedChildren &&
        component.aemMetadata.allowedChildren.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Allowed Child Components</h3>
            <div className="flex flex-wrap gap-2">
              {component.aemMetadata.allowedChildren.map((child) => (
                <span
                  key={child}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300"
                >
                  {child}
                </span>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
