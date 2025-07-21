// src/components/HowItWorksSection.jsx
const steps = [
    { num: 1, text: 'Create your free account.' },
    { num: 2, text: 'Add or sync subscriptions securely.' },
    { num: 3, text: 'Sit back—let us watch renewal dates.' },
  ];
  
  export default function HowItWorksSection() {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <ol className="space-y-8">
            {steps.map(({ num, text }) => (
              <li key={num} className="flex items-start md:items-center">
                <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full text-lg font-bold mr-4">
                  {num}
                </span>
                <p className="text-lg text-gray-700">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }
  