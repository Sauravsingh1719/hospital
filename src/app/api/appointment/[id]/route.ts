import dbConnect from "@/utils/dbConnect";
import Appointment from "@/model/Appointment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    
    try {
        const appointment = await Appointment.findById(params.id);
        if (!appointment) {
            return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: appointment }, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch appointment." }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    
    try {
        const { appointmentDate, timeSlot, status } = await request.json();
        
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            params.id,
            { appointmentDate, timeSlot, status },
            { new: true }
        );

        if (!updatedAppointment) {
            return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Appointment updated successfully.", data: updatedAppointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json({ success: false, message: "Failed to update appointment." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    
    try {
        const appointment = await Appointment.findById(params.id);
        if (!appointment) {
            return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
        }

        appointment.status = "canceled";
        await appointment.save();

        return NextResponse.json({ success: true, message: "Appointment canceled successfully." });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        return NextResponse.json({ success: false, message: "Failed to cancel appointment." }, { status: 500 });
    }
}
