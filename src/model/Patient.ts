import mongoose from "mongoose";

export interface Patient extends Document {
    name: string;
    patientId: number;
    email: string;
    phone: string;
    age: number;
    };

const PatientSchema = new mongoose.Schema<Patient>({
    patientId: { type: Number, required: true },
    name: {type: String, required:true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    age: {type: Number, required: true}
 })

const Patient = mongoose.models.Patient || mongoose.model<Patient>("Patient", PatientSchema);

export default Patient;