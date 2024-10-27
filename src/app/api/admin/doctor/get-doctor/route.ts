import Doctor from "@/model/Doctor";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
    await dbConnect();

    try {
        const doctors = await Doctor.find();
        return NextResponse.json({ success: true, data: doctors}, {status: 200});
    } catch (error) {
        console.error("Error fetching Doctors:", error);
        return NextResponse.json({success: false, message: "Failed to fetch Doctors."}, {status: 500});
    }
}