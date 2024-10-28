import TemporaryPatient from "@/model/TemporaryPatient";
import dbConnect from "@/utils/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = await params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
        }

        const tempPatient = await TemporaryPatient.findById(new mongoose.Types.ObjectId(id));
        if (!tempPatient) {
            return NextResponse.json({ success: false, message: "Patient not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: tempPatient }, { status: 200 });
    } catch (error) {
        console.error("Error fetching patient:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch patient" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
        }

        const tempPatient = await TemporaryPatient.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        if (!tempPatient) {
            return NextResponse.json({ success: false, message: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Patient deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting patient:", error);
        return NextResponse.json({ success: false, message: "Failed to delete patient" }, { status: 500 });
    }
}
