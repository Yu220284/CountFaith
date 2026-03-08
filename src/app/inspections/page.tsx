'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, User, DollarSign, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findNearbyPharmacists, assignQuest, issueProofOfFaith, type InspectionSite } from '@/lib/countfaith-api';

export default function Inspections() {
  const [selectedSite, setSelectedSite] = useState<InspectionSite | null>(null);
  const [loading, setLoading] = useState(false);
  const [pharmacists, setPharmacists] = useState<any[]>([]);
  const [selectedPharmacist, setSelectedPharmacist] = useState<any>(null);
  const [quest, setQuest] = useState<any>(null);
  const [proof, setProof] = useState<any>(null);

  const sites: InspectionSite[] = [
    { id: 's1', name: 'Tokyo Central Warehouse', address: 'Chiyoda, Tokyo, Japan', location: { lat: 35.6895, lng: 139.6917 }, riskLevel: 'high', type: 'warehouse' },
    { id: 's2', name: 'Mumbai Distribution Center', address: 'Mumbai, Maharashtra, India', location: { lat: 19.0760, lng: 72.8777 }, riskLevel: 'medium', type: 'pharmacy' },
    { id: 's3', name: 'Lagos Medical Hub', address: 'Lagos, Nigeria', location: { lat: 6.5244, lng: 3.3792 }, riskLevel: 'high', type: 'hospital' },
    { id: 's4', name: 'São Paulo Pharmacy', address: 'São Paulo, Brazil', location: { lat: -23.5505, lng: -46.6333 }, riskLevel: 'medium', type: 'pharmacy' },
    { id: 's5', name: 'Berlin Logistics', address: 'Berlin, Germany', location: { lat: 52.5200, lng: 13.4050 }, riskLevel: 'low', type: 'warehouse' }
  ];

  const handleFindPharmacists = async (site: InspectionSite) => {
    setLoading(true);
    setSelectedSite(site);
    setSelectedPharmacist(null);
    setQuest(null);
    setProof(null);
    
    const found = await findNearbyPharmacists(site);
    setPharmacists(found);
    setLoading(false);
  };

  const handleAssignQuest = async () => {
    if (!selectedSite || !selectedPharmacist) return;
    setLoading(true);
    
    const newQuest = await assignQuest(selectedSite, [selectedPharmacist]);
    setQuest({ ...newQuest, pharmacistId: selectedPharmacist.id });
    setLoading(false);
  };

  const handleIssueProof = async () => {
    if (!quest) return;
    setLoading(true);
    
    const newProof = await issueProofOfFaith(quest.id, quest.pharmacistId, 'LOT-2026-001', true);
    setProof(newProof);
    setLoading(false);
  };

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
            <Link href="/pharmacists" className="hover:text-primary transition-colors">Pharmacists</Link>
            <Link href="/inspections" className="text-primary">Inspections</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Inspection Check Creation</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>① Select Risk Site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sites.map((site) => (
                    <div
                      key={site.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSite?.id === site.id ? 'border-primary bg-primary/5' : 'hover:border-gray-400'
                      }`}
                      onClick={() => handleFindPharmacists(site)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{site.name}</h3>
                        <Badge variant={site.riskLevel === 'high' ? 'destructive' : site.riskLevel === 'medium' ? 'default' : 'secondary'}>
                          {site.riskLevel === 'high' ? 'High' : site.riskLevel === 'medium' ? 'Medium' : 'Low'} Risk
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{site.address}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {pharmacists.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>② Select Pharmacist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pharmacists.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedPharmacist?.id === p.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPharmacist(p)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-gray-600">{p.license}</p>
                          </div>
                          <Badge variant="outline">{p.distance.toFixed(1)}km</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Experience: {p.experience} years</p>
                      </div>
                    ))}
                    <Button
                      className="w-full"
                      onClick={handleAssignQuest}
                      disabled={loading || !selectedPharmacist}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign Quest (Blaxel)'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              {quest && (
                <Card>
                  <CardHeader>
                    <CardTitle>③ Quest Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Quest Assigned Successfully</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quest ID</span>
                        <span className="font-mono text-sm">{quest.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Site</span>
                        <span className="font-medium">{selectedSite?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned Pharmacist</span>
                        <span className="font-medium">{selectedPharmacist?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reward</span>
                        <span className="font-medium text-green-600">¥{quest.reward.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleIssueProof} disabled={loading || !!proof}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Issue Proof of Faith'}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {proof && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>④ Proof of Faith (Blaxel)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">Truth Certificate Issued</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificate ID</span>
                        <span className="font-mono">{proof.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lot Number</span>
                        <span className="font-mono">{proof.lotNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verification Result</span>
                        <Badge variant={proof.verified ? 'default' : 'destructive'}>
                          {proof.verified ? 'Authentic' : 'Suspected Counterfeit'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Digital Signature</span>
                        <span className="font-mono text-xs">{proof.signature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp</span>
                        <span className="text-xs">{new Date(proof.timestamp).toLocaleString('ja-JP')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
