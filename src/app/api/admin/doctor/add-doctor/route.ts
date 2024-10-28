import dbConnect from "@/utils/dbConnect";
import Doctor from "@/model/Doctor";
import { generateTimeSlots } from "@/helpers/availability";
import { NextResponse } from "next/server";

// Function to generate a random 6-digit ID
const generateUniqueDoctorId = async () => {
  let doctorId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a random 6-digit number
    doctorId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if this ID is already in use
    const existingDoctor = await Doctor.findOne({ doctorId });
    if (!existingDoctor) {
      isUnique = true;
    }
  }
  return doctorId;
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, department, fee, days, startTime, endTime, slotLengthInMinutes, hourlyLimit } = await request.json();

    // Generate a unique doctorId
    const doctorId = await generateUniqueDoctorId();

    // Generate time slots
    const timeSlots = generateTimeSlots(startTime, endTime, slotLengthInMinutes, hourlyLimit);

    // Create a new doctor
    const newDoctor = new Doctor({
      doctorId,
      name,
      department,
      fee,
      availability: {
        days,
        startTime,
        endTime,
        timeSlots,
      },
    });

    await newDoctor.save();

    return NextResponse.json(
      {
        success: true,
        message: "Doctor added successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add doctor.",
      },
      { status: 500 }
    );
  }
}
