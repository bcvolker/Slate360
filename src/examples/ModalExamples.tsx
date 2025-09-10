import React, { useState } from 'react';
import Modal, { ConfirmModal, FormModal } from '../components/Modal';

// Example 1: Basic Modal Usage
export function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Modal</h3>
      
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Open Basic Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal Example"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a basic modal with a title and content. You can customize the size, 
            animation, and other properties as needed.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Responsive design</li>
              <li>• Smooth animations</li>
              <li>• Keyboard navigation (ESC to close)</li>
              <li>• Click outside to close</li>
              <li>• Focus management</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Example 2: Different Modal Sizes
export function ModalSizesExample() {
  const [openSize, setOpenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full' | null>(null);

  const sizes = [
    { key: 'sm', label: 'Small', description: 'max-w-sm' },
    { key: 'md', label: 'Medium', description: 'max-w-md' },
    { key: 'lg', label: 'Large', description: 'max-w-lg' },
    { key: 'xl', label: 'Extra Large', description: 'max-w-xl' },
    { key: 'full', label: 'Full Width', description: 'max-w-full with margins' }
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modal Sizes</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sizes.map((size) => (
          <button
            key={size.key}
            onClick={() => setOpenSize(size.key)}
            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
          >
            {size.label}
          </button>
        ))}
      </div>

      {openSize && (
        <Modal
          isOpen={true}
          onClose={() => setOpenSize(null)}
          title={`${sizes.find(s => s.key === openSize)?.label} Modal`}
          size={openSize}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a <strong>{openSize}</strong> sized modal.
            </p>
            <p className="text-sm text-gray-500">
              CSS Class: <code className="bg-gray-100 px-2 py-1 rounded">{sizes.find(s => s.key === openSize)?.description}</code>
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                The modal automatically adjusts its width based on the size prop. 
                Try different sizes to see how they look!
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Example 3: Different Animations
export function ModalAnimationsExample() {
  const [openAnimation, setOpenAnimation] = useState<'fade' | 'slide' | 'scale' | 'slideUp' | null>(null);

  const animations = [
    { key: 'fade', label: 'Fade', description: 'Simple fade in/out' },
    { key: 'slide', label: 'Slide', description: 'Slide from left to right' },
    { key: 'scale', label: 'Scale', description: 'Scale up/down with fade' },
    { key: 'slideUp', label: 'Slide Up', description: 'Slide up from bottom' }
  ]as const;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Modal Animations</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {animations.map((animation) => (
          <button
            key={animation.key}
            onClick={() => setOpenAnimation(animation.key)}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
          >
            {animation.label}
          </button>
        ))}
      </div>

      {openAnimation && (
        <Modal
          isOpen={true}
          onClose={() => setOpenAnimation(null)}
          title={`${animations.find(a => a.key === openAnimation)?.label} Animation`}
          animation={openAnimation}
          animationDuration={0.4}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This modal uses the <strong>{openAnimation}</strong> animation.
            </p>
            <p className="text-sm text-gray-500">
              {animations.find(a => a.key === openAnimation)?.description}
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-800 text-sm">
                Each animation has different entrance and exit effects. 
                The animation duration can also be customized.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Example 4: Confirm Modal
export function ConfirmModalExample() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const handleDelete = () => {
    console.log('Delete confirmed!');
    // Your delete logic here
  };

  const handleUpdate = () => {
    console.log('Update confirmed!');
    // Your update logic here
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Confirm Modals</h3>
      
      <div className="flex space-x-3">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Item
        </button>
        
        <button
          onClick={() => setShowUpdateConfirm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Update Item
        </button>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      >
        <p className="text-sm text-gray-600">This will permanently remove the item from the system.</p>
      </ConfirmModal>

      {/* Update Confirmation */}
      <ConfirmModal
        isOpen={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={handleUpdate}
        title="Update Confirmation"
        message="Are you sure you want to update this item? Changes will be applied immediately."
        confirmText="Update"
        cancelText="Cancel"
        confirmVariant="success"
      >
        <p className="text-sm text-gray-600">Please review your changes before confirming.</p>
      </ConfirmModal>
    </div>
  );
}

// Example 5: Form Modal
export function FormModalExample() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setLoading(false);
    setShowForm(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Form Modal</h3>
      
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Open Contact Form
      </button>

      <FormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Contact Form"
        onSubmit={handleSubmit}
        submitText="Send Message"
        cancelText="Cancel"
        submitVariant="primary"
        loading={loading}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}

// Example 6: Custom Modal with Advanced Features
export function CustomModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [preventClose, setPreventClose] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Custom Modal Features</h3>
      
      <div className="flex space-x-3">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Open Custom Modal
        </button>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={preventClose}
            onChange={(e) => setPreventClose(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Prevent Close</span>
        </label>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Custom Modal"
        size="xl"
        animation="slideUp"
        animationDuration={0.5}
        closeOnOverlayClick={!preventClose}
        closeOnEscape={!preventClose}
        preventClose={preventClose}
        className="bg-gradient-to-br from-indigo-50 to-purple-50"
        overlayClassName="backdrop-blur-md"
        headerClassName="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-b-0"
        contentClassName="bg-transparent"
      >
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h4 className="font-medium text-gray-900 mb-2">Custom Styling</h4>
            <p className="text-gray-600 text-sm">
              This modal demonstrates custom styling with gradients, custom overlay effects, 
              and conditional close behavior.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-gray-900 mb-2">Advanced Features</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Custom background gradients</li>
              <li>• Conditional close prevention</li>
              <li>• Custom overlay effects</li>
              <li>• Flexible styling options</li>
            </ul>
          </div>
          
          {preventClose && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Close prevention is enabled. You cannot close this modal 
                by clicking outside or pressing ESC.
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              disabled={preventClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                preventClose 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {preventClose ? 'Cannot Close' : 'Close Modal'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Main example component that combines all examples
export function ModalExamples() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Modal Component Examples</h2>
      
      <BasicModalExample />
      <ModalSizesExample />
      <ModalAnimationsExample />
      <ConfirmModalExample />
      <FormModalExample />
      <CustomModalExample />
    </div>
  );
}
