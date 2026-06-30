import { dbConnect } from "@/lib/db";
import CompOffRequest from "@/models/CompOffRequest";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await dbConnect();

    // Handle both Promise and direct params (for compatibility)
    let id: string;
    if (context.params instanceof Promise) {
      const params = await context.params;
      id = params.id;
    } else {
      id = (context.params as { id: string }).id;
    }

    if (!id) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      );
    }

    console.log('Attempting to delete CompOffRequest with ID:', id);

    const result = await CompOffRequest.findByIdAndDelete(id);

    if (!result) {
      console.error('Request not found for deletion:', id);
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    console.log('Successfully deleted CompOffRequest:', id);

    return NextResponse.json(
      { success: true, message: "Request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete comp-off request:", error);
    return NextResponse.json(
      { error: "Failed to delete comp-off request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
