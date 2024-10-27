import dbConnect from "@/utils/dbConnect";
import Appointment from "@/model/Appointment";
import Doctor from "@/model/Doctor";
import Patient from "@/model/Patient";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { patientId, name, phone, doctorId, appointmentDate, timeSlot, paymentMethod } = await request.json();

    // Validate that paymentMethod is provided
    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Payment method is required." },
        { status: 400 }
      );
    }

    let assignedPatientId;

    // Check if patientId is provided
    if (patientId) {
      // Convert patientId to ObjectId
      try {
        assignedPatientId = new mongoose.Types.ObjectId(patientId);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Invalid patient ID format." },
          { status: 400 }
        );
      }
    } else {
      // Handle new patient case - add new patient to database
      const newPatient = new Patient({
        name,
        phone,
        patientId: Math.floor(Math.random() * 1000000), // Generate a simple ID for demo
        email: "", // Add email if required
        age: 0, // Adjust as needed
      });
      await newPatient.save();
      assignedPatientId = newPatient._id;
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
      paymentMethod, // Add paymentMethod here
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
