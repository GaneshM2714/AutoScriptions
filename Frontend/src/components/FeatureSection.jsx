// src/components/FeaturesSection.jsx
const features = [
    {
      title: 'Manual Entry',
      description: 'Add any subscription in seconds with smart suggestions.',
      icon: '📝',
    },
    {
      title: 'Auto Sync',
      description: 'Securely link banks & emails to detect recurring charges.',
      icon: '⚡',
    },
    {
      title: 'Spending Insights',
      description: 'Visualize monthly spend and spot unused services.',
      icon: '📊',
    },
  ];
  
  export default function FeatureSection() {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why You’ll Love It</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ title, description, icon }) => (
              <div key={title} className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  