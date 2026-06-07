import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, PlusCircle, Send, FileText, AlertCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const targetSchema = z.object({
  target: z.string().trim().min(1, "Target is required"),
  achievement: z.string().trim().min(1, "Achievement is required"),
});

const aparSchema = z.object({
  officerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  department: z.string().trim().min(2, "Department is required"),
  presentPosting: z.string().trim().min(2, "Present posting is required"),
  payGrade: z.string().trim().min(1, "Pay grade is required"),
  dob: z.string().min(1, "Date of birth is required"),
  qualifications: z.string().trim().optional(),
  targets: z.array(targetSchema).min(1, "At least one target is required"),
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAROON = "#7B1818";
const MAROON_DARK = "#5C1212";

const PAY_GRADES = [
  "Level 1 (₹18,000–56,900)",
  "Level 2 (₹19,900–63,200)",
  "Level 3 (₹21,700–69,100)",
  "Level 4 (₹25,500–81,100)",
  "Level 5 (₹29,200–92,300)",
  "Level 6 (₹35,400–1,12,400)",
  "Level 7 (₹44,900–1,42,400)",
  "Level 8 (₹47,600–1,51,100)",
  "Level 9 (₹53,100–1,67,800)",
  "Level 10 (₹56,100–1,77,500)",
  "Level 11 (₹67,700–2,08,700)",
  "Level 12 (₹78,800–2,09,200)",
  "Level 13 (₹1,18,500–2,14,100)",
  "Level 13A (₹1,31,100–2,16,600)",
  "Level 14 (₹1,44,200–2,18,200)",
];

// ---------------------------------------------------------------------------
// Tiny helpers
// ---------------------------------------------------------------------------
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: MAROON }}>
      <AlertCircle size={12} />
      {message}
    </p>
  );
}

function Label({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1 text-xs font-semibold tracking-wide uppercase text-gray-600"
    >
      {children}
      {required && <span className="ml-0.5" style={{ color: MAROON }}>*</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 transition-shadow";

const inputFocus = `focus:ring-[${MAROON}]/30 focus:border-[${MAROON}]`;

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function APARForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: zodResolver(aparSchema),
    defaultValues: {
      officerName: "",
      department: "",
      presentPosting: "",
      payGrade: "",
      dob: "",
      qualifications: "",
      targets: [{ target: "", achievement: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "targets" });

  const onSubmit = async (data) => {
    // TODO: Wire up to Spring Boot endpoint /api/v1/apar/submit once backend is ready
    await new Promise((r) => setTimeout(r, 800)); // Simulated network delay
    console.log("APAR Submission Payload:", data);
  };

  if (isSubmitSuccessful) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-10 text-center max-w-md w-full">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: `${MAROON}15` }}
          >
            <FileText size={28} style={{ color: MAROON }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Submission Received</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your APAR Part-IA has been submitted successfully. A confirmation will be sent
            to your registered email.
          </p>
          <button
            onClick={() => reset()}
            className="px-5 py-2 text-sm font-semibold text-white rounded transition-colors"
            style={{ backgroundColor: MAROON }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = MAROON_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = MAROON)}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className="rounded-t-lg px-8 py-5 flex items-center gap-4"
          style={{ backgroundColor: MAROON }}
        >
          <div className="flex-shrink-0">
            <FileText size={32} className="text-white opacity-90" />
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-white/70 font-medium">
              Government of India · NextGen HRMS
            </p>
            <h1 className="text-lg font-bold text-white leading-tight mt-0.5">
              Annual Performance Assessment Report (APAR)
            </h1>
            <p className="text-xs text-white/60 mt-0.5">Part-IA — Personal Data</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white shadow-md rounded-b-lg divide-y divide-gray-100"
        >
          {/* ── Section 1: Personal Information ── */}
          <section className="px-8 py-6">
            <SectionHeader>1. Personal Information</SectionHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
              <div>
                <Label htmlFor="officerName" required>
                  Name of Officer
                </Label>
                <input
                  id="officerName"
                  type="text"
                  placeholder="As per service records"
                  className={`${inputBase} ${inputFocus}`}
                  style={errors.officerName ? { borderColor: MAROON } : {}}
                  {...register("officerName")}
                />
                <FieldError message={errors.officerName?.message} />
              </div>

              <div>
                <Label htmlFor="dob" required>
                  Date of Birth
                </Label>
                <input
                  id="dob"
                  type="date"
                  className={`${inputBase} ${inputFocus}`}
                  style={errors.dob ? { borderColor: MAROON } : {}}
                  {...register("dob")}
                />
                <FieldError message={errors.dob?.message} />
              </div>

              <div>
                <Label htmlFor="department" required>
                  Department / Ministry
                </Label>
                <input
                  id="department"
                  type="text"
                  placeholder="e.g., Ministry of Electronics & IT"
                  className={`${inputBase} ${inputFocus}`}
                  style={errors.department ? { borderColor: MAROON } : {}}
                  {...register("department")}
                />
                <FieldError message={errors.department?.message} />
              </div>

              <div>
                <Label htmlFor="presentPosting" required>
                  Present Posting / Designation
                </Label>
                <input
                  id="presentPosting"
                  type="text"
                  placeholder="e.g., Deputy Director, NIC HQ"
                  className={`${inputBase} ${inputFocus}`}
                  style={errors.presentPosting ? { borderColor: MAROON } : {}}
                  {...register("presentPosting")}
                />
                <FieldError message={errors.presentPosting?.message} />
              </div>

              <div>
                <Label htmlFor="payGrade" required>
                  Pay Level / Grade Pay
                </Label>
                <Controller
                  name="payGrade"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="payGrade"
                      className={`${inputBase} ${inputFocus}`}
                      style={errors.payGrade ? { borderColor: MAROON } : {}}
                      {...field}
                    >
                      <option value="">— Select Pay Level —</option>
                      {PAY_GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <FieldError message={errors.payGrade?.message} />
              </div>
            </div>
          </section>

          {/* ── Section 2: Academic Qualifications ── */}
          <section className="px-8 py-6">
            <SectionHeader>2. Academic &amp; Professional Qualifications</SectionHeader>
            <div className="mt-4">
              <Label htmlFor="qualifications">Qualifications (Optional)</Label>
              <textarea
                id="qualifications"
                rows={3}
                placeholder="List relevant degrees, certifications, and professional qualifications…"
                className={`${inputBase} ${inputFocus} resize-none`}
                {...register("qualifications")}
              />
            </div>
          </section>

          {/* ── Section 3: Targets vs Achievements ── */}
          <section className="px-8 py-6">
            <div className="flex items-center justify-between">
              <SectionHeader>3. Work Output — Targets vs. Achievements</SectionHeader>
              <button
                type="button"
                onClick={() => append({ target: "", achievement: "" })}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border transition-colors"
                style={{ color: MAROON, borderColor: MAROON }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${MAROON}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <PlusCircle size={14} />
                Add Row
              </button>
            </div>

            {errors.targets && !Array.isArray(errors.targets) && (
              <FieldError message={errors.targets.message} />
            )}

            <div className="mt-4 overflow-x-auto rounded border border-gray-200">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 text-left w-8 font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Target Set <span style={{ color: MAROON }}>*</span>
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Achievement <span style={{ color: MAROON }}>*</span>
                    </th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {fields.map((field, index) => (
                    <tr key={field.id} className="bg-white hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-400 text-xs font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Describe target…"
                          className={`${inputBase} ${inputFocus} text-xs`}
                          style={
                            errors.targets?.[index]?.target
                              ? { borderColor: MAROON }
                              : {}
                          }
                          {...register(`targets.${index}.target`)}
                        />
                        <FieldError
                          message={errors.targets?.[index]?.target?.message}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Describe achievement…"
                          className={`${inputBase} ${inputFocus} text-xs`}
                          style={
                            errors.targets?.[index]?.achievement
                              ? { borderColor: MAROON }
                              : {}
                          }
                          {...register(`targets.${index}.achievement`)}
                        />
                        <FieldError
                          message={errors.targets?.[index]?.achievement?.message}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {/* First row is non-removable */}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove row"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Footer / Submit ── */}
          <div className="px-8 py-5 bg-gray-50 rounded-b-lg flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Fields marked <span style={{ color: MAROON }}>*</span> are mandatory. All
              data is subject to official verification.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: isSubmitting ? "#aaa" : MAROON }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = MAROON_DARK;
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.backgroundColor = MAROON;
              }}
            >
              <Send size={15} />
              {isSubmitting ? "Submitting…" : "Submit APAR"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          National Informatics Centre · Ministry of Electronics &amp; Information Technology
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <h2
      className="text-xs font-bold tracking-widest uppercase pb-2 border-b"
      style={{ color: MAROON, borderColor: `${MAROON}30` }}
    >
      {children}
    </h2>
  );
}
