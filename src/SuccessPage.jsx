import { useLocation } from "react-router-dom";

export default function SuccessPage() {
  const { state } = useLocation();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Form Details</h1>
      <ul className="space-y-2">
        {Object.entries(state || {}).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
}