// src/features/registration/components/CourseTag.jsx

export default function CourseTag({ course, onRemove, disabled }) {
  return (
    <div
      className="flex items-center gap-2 bg-blue-50 border border-blue-200 
                        rounded-lg px-3 py-2 text-sm"
    >
      <div className="flex flex-col">
        <span className="font-semibold text-blue-800">
          {course.course_code}
        </span>
        <span className="text-blue-600 text-xs">{course.course_title}</span>
      </div>
      <span
        className="ml-2 text-xs bg-blue-100 text-blue-700 
                             rounded-full px-2 py-0.5 whitespace-nowrap"
      >
        {course.unit} unit{course.unit > 1 ? "s" : ""}
      </span>
      {onRemove && (
        <button
          onClick={() => onRemove(course)}
          disabled={disabled}
          className="ml-1 text-blue-400 hover:text-red-500 
                               disabled:opacity-40 transition-colors"
          title="Remove course"
        >
          ✕
        </button>
      )}
    </div>
  );
}
