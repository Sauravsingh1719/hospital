import Patient from "@/model/Patient";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request: Request, {params}: {params: {id:string}}){
    await dbConnect();

    try {
        const {id} = params;
        const patient = await Patient.findById( new mongoose.Types.ObjectId(id));
        if(!patient) {
            return NextResponse.json({success: false, message: "Patient not found"}, {status: 404});
        }
        return NextResponse.json({success: true, data: patient}, {status: 200});
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({success: false, message: "Failed ot fetch Patient."}, {status: 500})
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { name, email, phone, age } = await request.json();

        const updatedPatient = await Patient.findByIdAndUpdate(
            params.id,
            { name, email, phone, age },
            { new: true }
        );

        if (!updatedPatient) {
            return NextResponse.json({ success: false, message: "Patient not found." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Patient updated successfully.",
            data: updatedPatient,
        });
    } catch (error) {
        console.error("Error updating patient:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update patient.",
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
  
    try {
      const { id } = params;
      const patient = await Patient.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      if (!patient) {
        return NextResponse.json({ success: false, message: "Patient not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Patient deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error("Error deleting patient:", error);
      return NextResponse.json({ success: false, message: "Failed to delete patient." }, { status: 500 });
    }
  }
  