import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    countryCode: "+91",
    phone: "",
    aadhaar: "",
    pan: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate every time form or touched changes
  useEffect(() => {
    const newErrors = {};

    // Required validation (only if touched)
    Object.keys(form).forEach((key) => {
      if (touched[key] && !form[key]) {
        newErrors[key] = "This field is required";
      }
    });

    // Email validation
    if (form.email && touched.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    // Aadhaar validation
    if (form.aadhaar && touched.aadhaar) {
      if (!/^\d{12}$/.test(form.aadhaar)) {
        newErrors.aadhaar = "Aadhaar must be exactly 12 digits";
      }
    }

    // PAN validation
    if (form.pan && touched.pan) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) {
        newErrors.pan = "PAN format invalid (ABCDE1234F)";
      }
    }

    // Phone validation
    if (form.phone && touched.phone) {
      if (!/^\d{10,}$/.test(form.phone)) {
        newErrors.phone = "Phone must be at least 10 digits";
      }
    }

    // Country code validation (optional)
    if (form.countryCode && touched.countryCode) {
      if (!/^\+\d+$/.test(form.countryCode)) {
        newErrors.countryCode = "Country code must start with + and digits";
      }
    }

    setErrors(newErrors);

    // Form is valid if no errors and all fields are non-empty
    setIsValid(
      Object.keys(newErrors).length === 0 &&
        Object.keys(form).every((k) => form[k])
    );
  }, [form, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "pan" ? value.toUpperCase() : value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    const allTouched = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    if (isValid) {
      navigate("/success", { state: form });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registration Form</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        {["firstName", "lastName", "email", "password", "aadhaar", "pan"].map(
          (field) => (
            <div key={field}>
              <input
                type={field === "password" && !showPassword ? "password" : "text"}
                name={field}
                placeholder={field.toUpperCase()}
                value={form[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 border rounded ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field] && touched[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          )
        )}

        {/* Country Code + Phone Number */}
        <div className="flex gap-2">
          <div className="w-1/4">
            <input
              type="text"
              name="countryCode"
              placeholder="+91"
              value={form.countryCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${
                errors.countryCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.countryCode && touched.countryCode && (
              <p className="text-red-500 text-sm">{errors.countryCode}</p>
            )}
          </div>
          <div className="w-3/4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-2 border rounded ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className={`p-2 rounded text-white ${
            isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
}