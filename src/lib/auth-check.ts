import { auth } from '@clerk/nextjs/server';
import connectDB from './db';
import User from '@/models/User';

export async function checkAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  await connectDB();
  const user = await User.findOne({ clerkId: userId });
  return user ? user.isAdmin : false;
}

export async function getLoggedUser() {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  const user = await User.findOne({ clerkId: userId });
  return user;
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
