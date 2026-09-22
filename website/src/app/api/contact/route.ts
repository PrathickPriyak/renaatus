import { jsonError } from "@/lib/http";

export async function POST() {
  return jsonError("Please submit your message using the website form.", 410, "GONE");
}

export async function GET() {
  return jsonError("Please submit your message using the website form.", 410, "GONE");
}
