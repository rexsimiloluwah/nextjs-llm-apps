import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log(process.env.PINECONE_INDEX_NAME);
  return NextResponse.json({ status: true, message: "Hello World" });
}
