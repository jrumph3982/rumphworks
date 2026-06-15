import { Resend } from "resend";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { formatIntakeEmail, type IntakeData } from "@/lib/intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = "Jamey.Rumph@rumphworks.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Rumphworks <onboarding@resend.dev>";

export async function POST(request: Request) {
  const data: IntakeData = await request.json();
  const contact = data?.contact;

  if (
    !contact ||
    typeof contact.name !== "string" ||
    typeof contact.email !== "string" ||
    !contact.name.trim() ||
    !contact.email.trim() ||
    !EMAIL_RE.test(contact.email)
  ) {
    return Response.json({ error: "Please provide your name and a valid email." }, { status: 400 });
  }

  try {
    await db.insert(leads).values({
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone?.trim() || null,
      businessName: contact.businessName?.trim() || null,
      status: "new",
      intakeData: data,
    });
  } catch (error) {
    console.error("Failed to save lead:", error);
    return Response.json({ error: "Something went wrong saving your information." }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: contact.email,
      subject: `New project inquiry from ${contact.name}`,
      text: formatIntakeEmail(data),
    });

    if (error) console.error("Resend send failed:", error);
  } else {
    console.error("RESEND_API_KEY is not configured");
  }

  return Response.json({ ok: true });
}
