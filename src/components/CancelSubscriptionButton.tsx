import toast from 'react-hot-toast';

interface CancelSubscriptionButtonProps {
  onCancel: () => void;
  disabled?: boolean;
}

export default function CancelSubscriptionButton({ onCancel, disabled = false }: CancelSubscriptionButtonProps) {
  const handleCancel = () => {
    onCancel();
    toast.success('Subscription canceled successfully.');
  };

  return (
    <button
      onClick={handleCancel}
      disabled={disabled}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-300 disabled:opacity-50"
    >
      Cancel Subscription
    </button>
  );
} 