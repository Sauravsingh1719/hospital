import Doctor from "@/model/Doctor";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET Method
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = await params;
        const doctor = await Doctor.findById(new mongoose.Types.ObjectId(id));
        if (!doctor) {
            return NextResponse.json({ success: false, message: "Doctor not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: doctor }, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch doctor." }, { status: 500 });
    }
}



// PUT Method
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { fee, availability, department } = await request.json();

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            params.id,
            { fee, availability, department },
            { new: true }
        );

        if (!updatedDoctor) {
            return NextResponse.json({ success: false, message: "Doctor not found." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Doctor updated successfully.",
            data: updatedDoctor,
        });
    } catch (error) {
        console.error("Error updating doctor:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update doctor.",
        }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
  
    try {
      const { id } = await params;
      const doctor = await Doctor.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      if (!doctor) {
        return NextResponse.json({ success: false, message: "Doctor not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Doctor deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return NextResponse.json({ success: false, message: "Failed to delete doctor." }, { status: 500 });
    }
  }
  