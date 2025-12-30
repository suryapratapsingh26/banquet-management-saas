export default function NewEnquiryForm() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 h-full">
      <h2 className="text-lg font-semibold mb-4 text-orange-600">
        New Enquiry Form
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <input placeholder="Client Name" className="input" />
        <input placeholder="Contact Number" className="input" />
        <select className="input">
          <option>Wedding Reception</option>
          <option>Corporate Event</option>
        </select>
        <input type="date" className="input" />
        <input placeholder="Guest Count" className="input" />
        <input placeholder="Special Requests" className="input" />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button className="btn-primary">Save Enquiry</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}