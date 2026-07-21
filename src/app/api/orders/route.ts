import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { getLoggedUser, checkAdmin } from '@/lib/auth-check';

export async function GET() {
  try {
    await connectDB();
    const isAdmin = await checkAdmin();
    const user = await getLoggedUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isAdmin) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    } else {
      const orders = await Order.find({ userId: user.clerkId }).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getLoggedUser();
    const data = await req.json();
    const { items, totalAmount, shippingDetails } = data;

    if (!items || !items.length || !totalAmount || !shippingDetails) {
      return NextResponse.json({ error: 'Missing order details' }, { status: 400 });
    }

    const userId = user ? user.clerkId : 'guest';

    // Save order in database
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      shippingDetails,
      status: 'pending',
    });

    // Award loyalty points if logged in (1 point per R$ spent)
    if (user) {
      const pointsToEarn = Math.floor(totalAmount);
      await User.findOneAndUpdate(
        { clerkId: user.clerkId },
        { $inc: { points: pointsToEarn } }
      );
    }

    // Format WhatsApp message text
    const storePhone = '5571992065352'; // WhatsApp checkout number
    const orderItemsText = items
      .map((item: { name: string; price: number; quantity: number }) => `- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)} cada)`)
      .join('\n');

    const messageText = `Olá ChocoMED! Gostaria de finalizar meu pedido:
*Pedido ID:* ${order._id}
*Cliente:* ${shippingDetails.name}
*Telefone:* ${shippingDetails.phone}
*Endereço:* ${shippingDetails.address}${shippingDetails.complement ? `, ${shippingDetails.complement}` : ''}
*Cidade/Estado:* ${shippingDetails.city} - ${shippingDetails.state}

*Itens do Pedido:*
${orderItemsText}

*Valor Total:* R$ ${totalAmount.toFixed(2)}
*Método de Finalização:* WhatsApp Checkout
*Origem:* E-commerce ChocoMED`;

    const whatsAppLink = `https://wa.me/${storePhone}?text=${encodeURIComponent(messageText)}`;

    // Update order with its WhatsApp link
    order.whatsAppLink = whatsAppLink;
    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      whatsAppLink,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
