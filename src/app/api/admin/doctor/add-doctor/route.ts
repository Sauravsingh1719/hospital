import dbConnect from "@/utils/dbConnect";
import Doctor from "@/model/Doctor";
import { generateTimeSlots } from "@/helpers/availability";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { doctorId, name, department, fee, days, startTime, endTime, slotLengthInMinutes, hourlyLimit } = await request.json();
    
    
    const existingDoctor = await Doctor.findOne({ doctorId });
    if (existingDoctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor with this ID already exists.",
        },
        { status: 400 }
      );
    }

   
    const timeSlots = generateTimeSlots(startTime, endTime, slotLengthInMinutes, hourlyLimit);

 
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
