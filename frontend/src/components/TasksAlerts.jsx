const items = [
  { text: "Payment Reminder: Kapoor Reception", color: "green" },
  { text: "Inventory Low: Beverage Stock", color: "red" },
  { text: "Staff Assignment Pending", color: "yellow" },
  { text: "Follow up on New Leads", color: "green" },
];

export default function TasksAlerts() {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className={`flex items-center gap-3 p-3 rounded bg-${item.color}-100 text-${item.color}-700`}
        >
          ● {item.text}
        </li>
      ))}
    </ul>
  );
}