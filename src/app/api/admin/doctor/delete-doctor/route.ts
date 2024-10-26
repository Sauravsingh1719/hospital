import dbConnect from "@/utils/dbConnect";
import Doctor from "@/model/Doctor";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { doctorId } = await request.json();

   
    const existingDoctor = await Doctor.findOne({ doctorId });
    if (!existingDoctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor not found.",
        },
        { status: 404 }
      );
    }

  
    await Doctor.deleteOne({ doctorId });

    return NextResponse.json(
      {
        success: true,
        message: "Doctor deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete doctor.",
      },
      { status: 500 }
    );
  }
}
