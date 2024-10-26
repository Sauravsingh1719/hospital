import mongoose from "mongoose";

export interface Appointment extends Document {
  patientId: mongoose.Schema.Types.ObjectId;
  doctorId: mongoose.Schema.Types.ObjectId;
  appointmentDate: Date;
  timeSlot: string; // Example: "09:00-09:30"
  status: "scheduled" | "completed" | "canceled";
  paymentMethod: "online" | "counter";
  createdAt: Date;
}

const AppointmentSchema = new mongoose.Schema<Appointment>({
  patientId: { type: mongoose.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Types.ObjectId, ref: "Doctor", required: true },
  appointmentDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
  paymentMethod: { type: String, enum: ["online", "counter"], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.models.Appointment || mongoose.model<Appointment>("Appointment", AppointmentSchema);

export default Appointment;
