import dbConnect from "@/utils/dbConnect";
import Patient from "@/model/Patient";
import TemporaryPatient from "@/model/TemporaryPatient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { tempPatientId, password } = await request.json();

    
    const tempPatient = await TemporaryPatient.findById(tempPatientId);
    if (!tempPatient) {
      return NextResponse.json(
        { success: false, message: "Temporary patient not found." },
        { status: 404 }
      );
    }

   
    const newPatient = new Patient({
      name: tempPatient.name,
      phone: tempPatient.phone,
      email: tempPatient.email,
      password,
    });
    await newPatient.save();
    await TemporaryPatient.deleteOne({ _id: tempPatientId });

    return NextResponse.json(
      { success: true, message: "Patient account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error converting temporary patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create patient account." },
      { status: 500 }
    );
  }
}
