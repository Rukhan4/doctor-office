import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Patient Registration Form",
  description: "Download the patient registration form.",
};

export default function PatientRegistrationFormPage() {
  redirect("/patient-registration-form.pdf");
}