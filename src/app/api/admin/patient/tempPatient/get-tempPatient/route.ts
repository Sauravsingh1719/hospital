import TemporaryPatient from "@/model/TemporaryPatient";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {
        const temporarypatients = await TemporaryPatient.find({}, '-__v');

        console.log("Fetched temporary patients count:", temporarypatients.length);

        return NextResponse.json({ success: true, data: temporarypatients }, { status: 200 });
    } catch (error) {
        console.error("Error fetching Patients:", error.message); // More specific error logging
        return NextResponse.json({ success: false, message: "Failed to fetch Patients" }, { status: 500 });
    }
}
