
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  orderId: string;
  type: 'order_received' | 'order_approved' | 'order_rejected' | 'order_completed';
  recipientType: 'vendor' | 'customer';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, type, recipientType }: NotificationRequest = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        vendors (
          name,
          store_name,
          whatsapp_number,
          email,
          user_id
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    let message = '';
    let recipientUserId = '';
    let whatsappNumber = '';

    // Determine message and recipient based on notification type
    switch (type) {
      case 'order_received':
        message = `🔔 New Order Alert!\n\nYou have received a new order from ${order.buyer_name}.\nTotal: $${order.total}\nDelivery: ${order.delivery_location}\n\nPlease check your dashboard to accept or reject the order.`;
        recipientUserId = order.vendors.user_id;
        whatsappNumber = order.vendors.whatsapp_number;
        break;
      
      case 'order_approved':
        message = `✅ Order Approved!\n\nGreat news! Your order has been approved by ${order.vendors.store_name || order.vendors.name}.\nOrder Total: $${order.total}\n\nThe vendor will start preparing your order soon.`;
        recipientUserId = order.user_id;
        // For customers, we don't have WhatsApp, so we'll just log the notification
        break;
      
      case 'order_rejected':
        message = `❌ Order Rejected\n\nWe're sorry, but your order has been rejected by ${order.vendors.store_name || order.vendors.name}.\nOrder Total: $${order.total}\n\nPlease try ordering from a different vendor.`;
        recipientUserId = order.user_id;
        break;
      
      case 'order_completed':
        message = `🎉 Order Completed!\n\nYour order has been completed and is ready for pickup/delivery.\nOrder Total: $${order.total}\n\nThank you for your business!`;
        recipientUserId = order.user_id;
        break;
    }

    // Save notification to database
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: recipientUserId,
        order_id: orderId,
        type,
        message,
        status: 'sent'
      });

    if (notificationError) {
      console.error('Error saving notification:', notificationError);
    }

    // For vendor notifications, we can use WhatsApp
    if (recipientType === 'vendor' && whatsappNumber) {
      // Generate WhatsApp link (this would typically be sent via WhatsApp Business API)
      const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      
      // In a real implementation, you would use WhatsApp Business API here
      console.log('WhatsApp notification would be sent to:', whatsappNumber);
      console.log('Message:', message);
      console.log('WhatsApp Link:', whatsappLink);
    }

    // For email notifications, you would integrate with a service like Resend here
    console.log('Notification sent successfully:', {
      orderId,
      type,
      recipientType,
      recipientUserId
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        orderId,
        type
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in send-notifications function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
