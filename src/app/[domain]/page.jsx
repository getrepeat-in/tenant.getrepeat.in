import { notFound } from 'next/navigation';

export default async function DomainPage({ params }) {
  const { domain } = await params;
  const restaurant = await fetchRestaurantData(domain);

  if (!restaurant) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to {restaurant.name}</h1>
        <p className="mb-4">This is the custom domain storefront for: {domain}</p>
        <div className="p-4 border rounded shadow">
          <h2>Store Content Goes Here</h2>
          <p>You can load products, menus, or themes based on the restaurant data.</p>
        </div>
      </div>
    </main>
  );
}

async function fetchRestaurantData(domain) {
  if (domain) return { name: 'Test Restaurant', domain }; 
  return null;
}
