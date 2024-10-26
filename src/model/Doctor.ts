import mongoose from "mongoose";
import { Review } from "./Review";

export interface TimeSlot {
  start: string;
  end: string;
  status: "available" | "booked";
  bookings: number;
}

export interface Doctor extends Document {
  name: string;
  doctorId: number;
  department: string;
  fee: number;
  reviews: Review[];
  averageRating: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
    timeSlots: Map<string, TimeSlot>;
  };
}

const DoctorSchema = new mongoose.Schema<Doctor>({
  doctorId: { type: Number, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  fee: { type: Number, required: true },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  availability: {
    days: { type: [String], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timeSlots: {
      type: Map,
      of: new mongoose.Schema({
        start: { type: String, required: true },
        end: { type: String, required: true },
        status: { type: String, enum: ["available", "booked"], default: "available" },
        bookings: { type: Number, default: 0 },
      }),
      default: {},
    },
  },
});

const Doctor = mongoose.models.Doctor || mongoose.model<Doctor>("Doctor", DoctorSchema);

export default Doctor;
