import { prisma } from "@/lib/prisma";

export async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(users);
  return users;
}
