import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "Document",
      name: "Annual Report 2023",
      action: "Uploaded",
      user: "John Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Meeting",
      name: "Quarterly Planning",
      action: "Scheduled",
      user: "Jane Smith",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "Task",
      name: "Budget Approval",
      action: "Completed",
      user: "Robert Johnson",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "Member",
      name: "Sarah Williams",
      action: "Added",
      user: "Michael Brown",
      time: "2 days ago",
    },
    {
      id: 5,
      type: "Project",
      name: "Website Redesign",
      action: "Started",
      user: "Emily Davis",
      time: "3 days ago",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Recent Activities
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.type}</TableCell>
              <TableCell>{activity.name}</TableCell>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.user}</TableCell>
              <TableCell className="text-right">{activity.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
