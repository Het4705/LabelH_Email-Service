const formatEmail = ({ user, order, products }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">Order Confirmation</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Thank you for your order. Here are the details:</p>

      <h3>Order Summary</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${order.date}</p>
      <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
      <h3>Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Product</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Size</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Quantity</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Price</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Your Customization</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="padding: 8px;">
                <img src="${p.image}" alt="${p.name}" style="width: 80px; vertical-align: middle; margin-right: 10px;">
                ${p.name}
              </td>
              <td style="padding: 8px;">${p.size?.length || 'N/A'}</td>
              <td style="padding: 8px;">${p.quantity}</td>
              <td style="padding: 8px;">₹${p.price}</td>
              <td style="padding: 8px;">${p?.customization}</td?
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p style="margin-top: 20px;">Shipping to: <em>${formatAddress(order?.shippingAddress)}</em></p>
      <p>We’ll notify you once your order has been shipped.</p>

      <hr style="margin: 30px 0;" />

      <p>Thank you for choosing Label H.</p>
      <p><a href="https://test-label-h-lnro.vercel.app/" target="_blank" style="color: #3498db;">Visit our website</a></p>
      <img src="https://res.cloudinary.com/dtdixmfnd/image/upload/v1749370321/logo_ugnpfz.jpg" alt="Label H" style="width: 120px; margin-top: 20px;" />
    </div>
  `;
};

const formatAdminEmail = ({ user, order, products }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">New Order Placed</h2>
      <p>A customer has placed a new order. Below are the details:</p>

      <h3>User Details</h3>
      <ul>
        <li><strong>User ID:</strong> ${user.id || 'N/A'}</li>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
      </ul>

      <h3>Order Summary</h3>
      <ul>
        <li><strong>Order ID:</strong> ${order.id}</li>
        <li><strong>Date:</strong> ${order.date}</li>
        <li><strong>Total:</strong> ₹${order.total.toFixed(2)}</li>
        <li><strong>Shipping Address:</strong> ${formatAddress(order?.shippingAddress)}</li>
      </ul>

      <h3>Ordered Products</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f8f8;">
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Product</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Quantity</th>
            <th align="left" style="padding: 8px; border-bottom: 1px solid #ccc;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="padding: 8px;">${p.name}</td>
              <td style="padding: 8px;">${p.quantity}</td>
              <td style="padding: 8px;">₹${p.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p style="margin-top: 20px;">Please check the admin dashboard for full details.</p>

      <hr style="margin: 30px 0;" />
      <p>This is an automated notification from your order management system.</p>
    </div>
  `;
};
const formatAddress = (address) => {
  if (!address) return 'N/A';
  return `
    ${address.name}<br>
    ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}<br>
    ${address.city}, ${address.state} ${address.postalCode}<br>
    ${address.country}<br>
    Phone: ${address.phoneNumber}
  `;
};


module.exports = { formatEmail, formatAdminEmail };