interface FormInputProps {
  label: string;
  type?: string;

  name: string;
  error?: string;
}

export default function FormInput({
  label,
  type = "text",

  error,
}: FormInputProps) {
  return (
    <div className="mb-3">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        className={`w-full border p-2 rounded focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
