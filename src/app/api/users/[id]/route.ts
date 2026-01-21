import { NextResponse } from 'next/server';

type Params = {
  params: {
    id: string;
  };
};

// GET /api/users/:id
export async function GET(_: Request, { params }: Params) {
  const { id } = params;

  return NextResponse.json({
    id,
    name: 'Sample User',
  });
}

// PUT /api/users/:id
export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();

  return NextResponse.json({
    message: `User ${params.id} updated`,
    updatedData: body,
  });
}

// DELETE /api/users/:id
export async function DELETE(_: Request, { params }: Params) {
  return NextResponse.json(
    { message: `User ${params.id} deleted` },
    { status: 200 }
  );
}
