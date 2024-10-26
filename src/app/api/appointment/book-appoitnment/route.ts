import Appointment from "@/model/Appointment";
import Doctor from "@/model/Doctor";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect();

    try {
        const {patientId}
    } catch (error) {
        
    }
}