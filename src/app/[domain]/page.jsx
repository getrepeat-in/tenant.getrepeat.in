import { notFound } from 'next/navigation';
import Home from '../../components/pages/home';

export default async function DomainPage({ params }) {
  const { domain } = await params;
  
  // Query your DB here to validate the tenant exists.
  // If they don't exist (e.g. invalid subdomain or custom domain), return a 404
  const restaurant = await fetchRestaurantData(domain);

  if (!restaurant) {
    return notFound();
  }

  // Render the exact same Home component that your main application uses!
  // You can pass the domain or restaurant data as props if needed.
  return <Home />;
}

// Placeholder function - replace with actual DB call
async function fetchRestaurantData(domain) {
  if (domain) return { name: 'Test Restaurant', domain }; 
  return null;
}
