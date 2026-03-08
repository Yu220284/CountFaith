'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeTampering, type TamperAnalysis } from '@/lib/countfaith-api';

export default function Dashboard() {
  const [stats] = useState({
    activeQuests: 12,
    completedToday: 8,
    availablePharmacists: 45,
    highRiskSites: 3
  });

  const [analysis, setAnalysis] = useState<TamperAnalysis[]>([]);

  useEffect(() => {
    analyzeTampering().then(setAnalysis);
  }, []);

  const recentQuests = [
    { id: 'q1', site: 'Tokyo Central Warehouse', pharmacist: 'Hanako Tanaka', status: 'in-progress', risk: 'high' },
    { id: 'q2', site: 'Mumbai Distribution', pharmacist: 'Raj Patel', status: 'completed', risk: 'medium' },
    { id: 'q3', site: 'Lagos Medical Hub', pharmacist: 'Maria Silva', status: 'assigned', risk: 'low' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/image.png" alt="CountFaith" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-primary">CountFaith</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-primary">Dashboard</Link>
            <Link href="/pharmacists" className="hover:text-primary transition-colors">Pharmacists</Link>
            <Link href="/inspections" className="hover:text-primary transition-colors">Inspections</Link>
            <Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Inspections</CardTitle>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeQuests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedToday}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Available Pharmacists</CardTitle>
                <Users className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availablePharmacists}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">High Risk Sites</CardTitle>
                <MapPin className="w-4 h-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.highRiskSites}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Tampering Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.length > 0 ? analysis.map((site) => (
                    <div key={site.siteId} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{site.siteName}</h3>
                        <Badge variant={site.riskScore > 60 ? 'destructive' : site.riskScore > 30 ? 'default' : 'secondary'}>
                          Risk: {site.riskScore}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Feedback Count: {site.feedbackCount}</p>
                        <p>Avg Effectiveness: {site.averageEffectiveness}/5.0</p>
                        {site.suspiciousLots.length > 0 && (
                          <p className="text-red-600">Suspicious Lots: {site.suspiciousLots.join(', ')}</p>
                        )}
                        {site.aiInsight && (
                          <p className="text-blue-600 mt-2 pt-2 border-t">
                            <span className="font-medium">AI Insight:</span> {site.aiInsight}
                          </p>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Collecting data...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Recent Inspection Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{quest.site}</p>
                        <p className="text-sm text-gray-500">Assigned: {quest.pharmacist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={quest.risk === 'high' ? 'destructive' : quest.risk === 'medium' ? 'default' : 'secondary'}>
                        {quest.risk === 'high' ? 'High' : quest.risk === 'medium' ? 'Medium' : 'Low'} Risk
                      </Badge>
                      <Badge variant={quest.status === 'completed' ? 'default' : 'outline'}>
                        {quest.status === 'completed' ? 'Completed' : quest.status === 'in-progress' ? 'In Progress' : 'Assigned'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link href="/inspections">View All Inspections</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
