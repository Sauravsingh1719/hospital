import Patient from "@/model/Patient";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    await dbConnect();

    try {
        const {patientId} = await request.json();

        const existingPatient = await Patient.findOne({patientId});
        if(!existingPatient) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Patient not found.",
                },
                {
                    status:404
                }
            );
        }

        await Patient.deleteOne({patientId});

        return NextResponse.json(
            {
                success: true,
                message: "Patient deleted successfully.",
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Error deleting Patient:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to delete Patient.",
        },
    {status: 500});
    }
}