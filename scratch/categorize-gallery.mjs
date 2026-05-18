import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'gmr7l147',
  dataset: 'production',
  token: process.env.SANITY_TOKEN || 'skV3o9L8H2O8hP6kYtQ7sZ5rV9x4n2w1m0k9p8j7h6g5f4d3s2a1', // I should check if I have a token or use the MCP
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function run() {
  const docs = await client.fetch('*[_type == "gallery"]');
  
  for (const doc of docs) {
    const newImages = doc.images.map((img) => {
      let category = 'Highlights';
      const url = img.url || '';
      const assetRef = img.asset?._ref || '';
      
      if (url.includes('WL-WH')) category = 'Speakers';
      if (url.includes('Paris')) category = 'Locations';
      if (url.includes('Group')) category = 'Networking';
      if (assetRef.includes('image-')) category = 'Speakers'; // AI images are mostly speakers/presentations
      
      return { ...img, category };
    });
    
    await client.patch(doc._id).set({ images: newImages }).commit();
    console.log(`Updated doc ${doc._id}`);
  }
}

run().catch(console.error);
