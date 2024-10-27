import dbConnect from "@/utils/dbConnect";
import Appointment from "@/model/Appointment";
import Doctor from "@/model/Doctor";
import Patient from "@/model/Patient";
import TemporaryPatient from "@/model/TemporaryPatient"; // Import the TemporaryPatient model
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, phone, doctorId, appointmentDate, timeSlot, paymentMethod } = await request.json();

    // Validate that paymentMethod is provided
    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method is required." },
        { status: 400 }
      );
    }

    // Check if the user is already a registered patient
    const existingPatient = await Patient.findOne({ phone });
    let assignedPatientId;

    if (existingPatient) {
      assignedPatientId = existingPatient._id;
    } else {
      // Save the temporary patient details
      const tempPatient = new TemporaryPatient({
        name,
        email,
        phone,
        appointmentDate,
      });
      await tempPatient.save();
      assignedPatientId = tempPatient._id; // Use temporary patient ID
    }

    // Convert doctorId to ObjectId
    let doctorObjectId;
    try {
      doctorObjectId = new mongoose.Types.ObjectId(doctorId);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid doctor ID format." },
        { status: 400 }
      );
    }

    // Fetch the doctor using ObjectId
    const doctor = await Doctor.findById(doctorObjectId);
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: "Doctor not found." },
        { status: 404 }
      );
    }

    // Check if the selected time slot is available
    const selectedTimeSlot = doctor.availability.timeSlots.get(timeSlot);
    if (selectedTimeSlot && selectedTimeSlot.status === "booked") {
      return NextResponse.json(
        { success: false, message: "Selected time slot is already booked." },
        { status: 400 }
      );
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientId: assignedPatientId,
      name,
      phone,
      doctorId: doctor._id,
      appointmentDate,
      timeSlot,
      paymentMethod,
    });

    await newAppointment.save();

    return NextResponse.json(
      { success: true, message: "Appointment booked successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to book appointment." },
      { status: 500 }
    );
  }
}
