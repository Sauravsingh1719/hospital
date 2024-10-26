import Patient from "@/model/Patient";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    await dbConnect()

    try{
        const {name, patientId, email, phone, age} = await request.json();

        const existingPatient = await Patient.findOne({ phone });
        if(existingPatient) {
            return NextResponse.json(
                {
                success: false,
          message: "Patient with this Phone already exists.",
            }, {status: 400}
        )
        }

        const newPatient = new Patient ({
          patientId, 
            name,
            email,
            phone,
            age
        })
        await newPatient.save();

    return NextResponse.json(
      {
        success: true,
        message: "Patient added successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding Patient:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add Patient.",
      },
      { status: 500 }
    );
    }  
}

