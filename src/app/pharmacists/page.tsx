'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Pharmacists() {
  const [pharmacists] = useState([
    { id: 'p1', name: 'Hanako Tanaka', license: 'PH-123456', location: 'Shibuya, Tokyo', experience: 8, available: true, completed: 45 },
    { id: 'p2', name: 'Raj Patel', license: 'PH-789012', location: 'Mumbai, India', experience: 12, available: true, completed: 78 },
    { id: 'p3', name: 'Maria Silva', license: 'PH-345678', location: 'São Paulo, Brazil', experience: 5, available: false, completed: 23 }
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/image.png" alt="CountFaith" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-primary">CountFaith</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/pharmacists" className="text-primary">Pharmacists</Link>
            <Link href="/inspections" className="hover:text-primary transition-colors">Inspections</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Registered Pharmacists</h1>
            <Button>Register New</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacists.map((pharmacist) => (
              <Card key={pharmacist.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{pharmacist.name}</CardTitle>
                    <Badge variant={pharmacist.available ? 'default' : 'secondary'}>
                      {pharmacist.available ? 'Available' : 'On Duty'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">License: {pharmacist.license}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{pharmacist.location}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-medium">{pharmacist.experience} years</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-medium">{pharmacist.completed} checks</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
