import { NextResponse } from 'next/server';

// GET /api/users
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  return NextResponse.json({
    page,
    limit,
    data: users,
  });
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'User created',
        user: body,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}
