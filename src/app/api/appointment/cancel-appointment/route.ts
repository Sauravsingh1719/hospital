import Appointment from "@/model/Appointment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    await dbConnect();

    try {
        const { id, newDate, newTimeSlot } = await request.json();

        // Check if the appointment exists
        const existingAppointment = await Appointment.findById(id);
        if (!existingAppointment) {
            return NextResponse.json(
                { success: false, message: "Appointment not found." },
                { status: 404 }
            );
        }

        // Update appointment date and timeSlot
        existingAppointment.appointmentDate = newDate;
        existingAppointment.timeSlot = newTimeSlot;
        await existingAppointment.save();

        return NextResponse.json(
            { success: true, message: "Appointment updated successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update appointment." },
            { status: 500 }
        );
    }
}
