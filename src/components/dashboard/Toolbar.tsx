export default function Toolbar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div>{/* Action buttons, AI toggles, etc. go here */}</div>
    </div>
  );
}
