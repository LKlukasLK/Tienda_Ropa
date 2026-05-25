import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { CheckoutForm } from '../components/FormularioPago';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const paymentIntentRequested = useRef(false);
    const { pedidoId, total } = location.state || {}; // Recibimos datos del carrito
    const stripeOptions = useMemo(
        () => clientSecret ? { clientSecret } : undefined,
        [clientSecret]
    );

    useEffect(() => {
        if (!pedidoId) {
            navigate('/carrito');
            return;
        }

        if (paymentIntentRequested.current) return;
        paymentIntentRequested.current = true;

        // Pedir el clientSecret al Backend
        api.post('/pagos/crear-intento', { pedidoId })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(err => {
                paymentIntentRequested.current = false;
                console.error(err);
            });
    }, [pedidoId, navigate]);

    return (
        <div className="max-w-xl mx-auto px-4 py-20">
            <h1 className="text-3xl font-black mb-8">Finalizar Pago</h1>
            {clientSecret && stripeOptions ? (
                <Elements key={clientSecret} stripe={stripePromise} options={stripeOptions}>
                    <CheckoutForm total={total} />
                </Elements>
            ) : (
                <p>Preparando entorno de pago seguro...</p>
            )}
        </div>
    );
};
