import Patient from "@/model/Patient";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
    await dbConnect();

    try {
        const patients = await Patient.find();
        return NextResponse.json({success: true, data: patients}, {status: 200});
    } catch (error) {
        console.error("Error fetching Ptients:", error);
        return NextResponse.json({success: false, message: "Failed ot fetch Patients"}, {status: 500})
    }
}