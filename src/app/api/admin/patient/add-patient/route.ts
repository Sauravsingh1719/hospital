import Patient from "@/model/Patient";
import TemporaryPatient from "@/model/TemporaryPatient";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { phone, userId, password } = await request.json();

        
        const tempPatient = await TemporaryPatient.findOne({ phone });
        if (tempPatient) {
          
            const newPatient = new Patient({
                name: tempPatient.name, 
                phone,
                email: tempPatient.email, 
                patientId: Math.floor(Math.random() * 1000000), 
                age: tempPatient.age, 
                userId,
                password
            });
            await newPatient.save();
            await TemporaryPatient.deleteOne({ _id: tempPatient._id }); 
            return NextResponse.json(
                {
                    success: true,
                    message: "Temporary patient converted to permanent successfully.",
                },
                { status: 201 }
            );
        } else {
            
            const existingPatient = await Patient.findOne({ phone });
            if (existingPatient) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Patient with this Phone already exists.",
                    },
                    { status: 400 }
                );
            }

            const newPatient = new Patient({
                phone,
                userId,
                password,
                patientId: Math.floor(Math.random() * 1000000),
                
            });
            await newPatient.save();

            return NextResponse.json(
                {
                    success: true,
                    message: "New patient added successfully.",
                },
                { status: 201 }
            );
        }
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
