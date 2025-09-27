const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { panier } = req.body;
 console.log("retrieving sessionId", panier,process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      /* payment_method_types: ['card'],
      line_items: panier.map(item => ({
        price: item.id,
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: 'https://votresite.com/success',
      cancel_url: 'https://votresite.com/cancel', */

      payment_method_types: ['card'],
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: 'Produit Exemple',
      },
      unit_amount: 2000,
    },
    quantity: 1,
  }],
  success_url: `${req.headers.origin}/success`,
  cancel_url: `${req.headers.origin}/cancel`,
    });
    //console.error(error);
    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de session' });
  }
});

app.get('/', (req, res) => {
  res.send('API Stripe en ligne 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
