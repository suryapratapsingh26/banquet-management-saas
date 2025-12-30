export default function BookingConfirmation() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">
        Booking Confirmation
      </h2>

      <div className="text-sm space-y-1">
        <p><strong>Booking ID:</strong> BK-10234</p>
        <p><strong>Client:</strong> Rajesh Sharma</p>
        <p><strong>Event:</strong> Wedding Reception</p>
        <p><strong>Guest Count:</strong> 250</p>
        <p className="text-green-600 font-semibold mt-2">
          Advance Paid ✔
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="btn-primary">Print Contract</button>
        <button className="btn-success">Send Confirmation</button>
        <button className="btn-secondary">Back to Dashboard</button>
      </div>
    </div>
  );
}