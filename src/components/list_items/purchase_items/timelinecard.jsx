import Timeline from './timeline';

const TicketCard = ({ ticket }) => {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">{ticket.MaterialName}</h3>
      <p><strong>Quantity:</strong> {ticket.Quantity}</p>
      <p><strong>Description:</strong> {ticket.Description}</p>
      <Timeline currentStatus={ticket.Status} />
    </div>
  );
};
