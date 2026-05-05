const locations = [
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Port Harcourt, Nigeria",
  "Ibadan, Nigeria",
  "Kano, Nigeria",
  "Abeokuta, Nigeria",
];

export async function GET() {
  return Response.json({ locations });
}
