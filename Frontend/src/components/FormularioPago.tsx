import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export const CheckoutForm = ({ total }: { total: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // A dónde redirigir tras el pago exitoso
                return_url: "http://localhost:5173/pago-exitoso",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "Error en el pago");
        } else {
            setMessage("Ocurrió un error inesperado.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
                {isLoading ? "Procesando..." : `Pagar ahora (${total}€)`}
            </button>
            {message && <div className="text-red-500 text-sm font-medium mt-4">{message}</div>}
        </form>
    );
};