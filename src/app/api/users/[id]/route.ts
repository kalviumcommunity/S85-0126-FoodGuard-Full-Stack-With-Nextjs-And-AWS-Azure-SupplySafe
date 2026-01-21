import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    return sendSuccess(user, "User fetched successfully");
  } catch (error) {
    return sendError(
      "Failed to fetch user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, email, role } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return sendError(
          "Invalid email format",
          ERROR_CODES.INVALID_EMAIL,
          400
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return sendError(
          "Email already in use",
          ERROR_CODES.DUPLICATE_EMAIL,
          409
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return sendSuccess(updatedUser, "User updated successfully");
  } catch (error) {
    return sendError(
      "Failed to update user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return sendError("User not found", ERROR_CODES.USER_NOT_FOUND, 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return sendSuccess({ id }, "User deleted successfully");
  } catch (error) {
    return sendError(
      "Failed to delete user",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
