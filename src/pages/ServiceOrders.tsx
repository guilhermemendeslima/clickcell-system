import React, { useState } from 'react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Printer, Smartphone, Laptop, Monitor, HardDrive } from 'lucide-react';

const ServiceOrders = () => {
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    issueDescription: '',
    maintenanceHistory: '',
    technicalNotes: '',
    estimatedCompletionDate: '',
  });

  const deviceTypes = [
    { type: 'printer', icon: Printer, label: 'Printer' },
    { type: 'smartphone', icon: Smartphone, label: 'Smartphone' },
    { type: 'laptop', icon: Laptop, label: 'Laptop' },
    { type: 'monitor', icon: Monitor, label: 'Monitor' },
    { type: 'storage', icon: HardDrive, label: 'Storage Device' },
  ];

  const handleDeviceTypeSelect = (type: string) => {
    setSelectedDeviceType(type);
    setFormData(prev => ({ ...prev, deviceType: type }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const serviceOrders = [
    {
      id: 1,
      customerName: 'John Doe',
      deviceType: 'laptop',
      brand: 'Dell',
      model: 'XPS 15',
      status: 'In Progress',
      estimatedCompletion: '2024-02-20',
    },
    // Add more mock data as needed
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Service Orders</h1>
      
      <Card className="mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Customer Name</label>
              <Input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Device Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {deviceTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleDeviceTypeSelect(type)}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-colors ${
                      selectedDeviceType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedDeviceType && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <Input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <Input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Enter model"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Serial Number</label>
                  <Input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Enter serial number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Issue Description</label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Describe the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maintenance History</label>
                <textarea
                  name="maintenanceHistory"
                  value={formData.maintenanceHistory}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                  placeholder="Previous maintenance records"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Technical Notes</label>
                <textarea
                  name="technicalNotes"
                  value={formData.technicalNotes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                  placeholder="Technical details and notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Completion Date</label>
                <Input
                  type="date"
                  name="estimatedCompletionDate"
                  value={formData.estimatedCompletionDate}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full md:w-auto">
            Create Service Order
          </Button>
        </form>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Completion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {serviceOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.brand} {order.model}
                  </div>
                  <div className="text-sm text-gray-500">{order.deviceType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={order.status === 'In Progress' ? 'blue' : 'green'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.estimatedCompletion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceOrders;