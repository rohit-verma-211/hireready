import React from "react";

const TemplateModal = ({
  showTemplates,
  setShowTemplates,
  template,
  setTemplate,
  templates,
}) => {
  if (!showTemplates) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4"
      onClick={() => setShowTemplates(false)}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Choose Resume Template
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Select a template that best suits your style.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                if (t.disabled) return;
                setTemplate(t.id);
              }}
              className={`border-2 rounded-2xl p-4 transition-all
                ${
                  t.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                ${
                  !t.disabled && template === t.id
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-400"
                }`}
            >
              <div className="w-full aspect-[3/4] rounded-lg bg-gray-100 overflow-hidden mb-3">
                <img
                  src={t.preview}
                  alt={t.label}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {t.label}
                </h3>

                {t.disabled ? (
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                ) : (
                  template === t.id && (
                    <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setShowTemplates(false)}
            className="px-6 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => setShowTemplates(false)}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;