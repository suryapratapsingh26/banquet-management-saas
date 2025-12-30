import NewEnquiryForm from "./NewEnquiryForm.jsx";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";
import QuotationBuilder from "./QuotationBuilder.jsx";
import BookingConfirmation from "./BookingConfirmation.jsx";

export default function SalesDashboard() {
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <NewEnquiryForm />
      <AvailabilityCalendar />
      <QuotationBuilder />
      <BookingConfirmation />
    </div>
  );
}