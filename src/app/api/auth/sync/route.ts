import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Usuário ChocoMED';
        user = await User.create({
          clerkId: userId,
          email,
          name,
          points: 0,
          isAdmin: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      isAdmin: user?.isAdmin || false,
      points: user?.points || 0,
      name: user?.name,
      email: user?.email,
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
