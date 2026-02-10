import React, { useState, useEffect } from "react";

const FacultyModal = ({
  isOpen,
  onClose,
  handleSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
  });

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        abbreviation: initialData.abbreviation || "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : null}
      />

      {/* Modal Card */}
      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md z-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Faculty</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Faculty Name
            </label>
            <input
              type="text"
              name="name"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Abbreviation
            </label>
            <input
              type="text"
              name="abbreviation"
              required
              disabled={isSubmitting}
              value={formData.abbreviation}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition-colors disabled:bg-indigo-300 flex items-center justify-center min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyModal;
