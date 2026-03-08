const CRUSTDATA_API_KEY = process.env.NEXT_PUBLIC_CRUSTDATA_API_KEY;
const BASE_URL = 'https://api.crustdata.com';

export interface PharmacistProfile {
  name: string;
  linkedin_profile_url: string;
  location: string;
  headline: string;
  current_employers?: Array<{
    employer_name: string;
    employee_title: string;
  }>;
  years_of_experience_raw?: number;
}

export async function findNearbyPharmacists(
  location: string,
  radiusKm: number = 50
): Promise<PharmacistProfile[]> {
  const response = await fetch(`${BASE_URL}/screener/persondb/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${CRUSTDATA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters: {
        op: 'and',
        conditions: [
          {
            column: 'region',
            type: 'geo_distance',
            value: {
              location,
              distance: radiusKm,
              unit: 'km'
            }
          },
          {
            column: 'current_employers.title',
            type: '(.)',
            value: 'pharmacist'
          },
          {
            column: 'years_of_experience_raw',
            type: '=>',
            value: 3
          }
        ]
      },
      limit: 100
    })
  });

  if (!response.ok) {
    throw new Error(`Crustdata API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.profiles || [];
}
