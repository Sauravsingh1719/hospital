import mongoose, { Document } from "mongoose";

export interface TemporaryPatient extends Document {
    name: string;
    phone: string;
    email: string;
    appointmentDate: Date;
    createdAt: Date;
}

const TemporaryPatientSchema = new mongoose.Schema<TemporaryPatient>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true }, 
    email: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }, 
});

const TemporaryPatient = mongoose.models.TemporaryPatient || mongoose.model<TemporaryPatient>("TemporaryPatient", TemporaryPatientSchema);

export default TemporaryPatient;
