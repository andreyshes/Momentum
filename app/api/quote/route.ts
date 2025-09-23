import { NextResponse } from "next/server";

export async function GET() {
	const resp = await fetch("https://zenquotes.io/api/random");
	// Forward the JSON to the client
	const data = await resp.json();
	return NextResponse.json(data);
}
