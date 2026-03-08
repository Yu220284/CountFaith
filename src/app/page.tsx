import Link from 'next/link';
import Image from 'next/image';
import { Building2, Users, CheckCircle2, Target, Shield, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/image.png" alt="CountFaith" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-primary">CountFaith</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/pharmacists" className="hover:text-primary transition-colors">Pharmacists</Link>
            <Link href="/inspections" className="hover:text-primary transition-colors">Inspections</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Stop Counterfeit Drugs with Expert Eyes
            </h1>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-700">
              AI detects risks. Pharmacists verify authenticity.<br />
              Protecting pharmaceutical supply chains with digital intelligence and human responsibility.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/dashboard">For Providers</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pharmacists">For Pharmacists</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/feedback">For Patients</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <AlertTriangle className="w-12 h-12 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900">The Crisis</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-red-600 mb-2">1 in 10</div>
                    <p className="text-gray-700">medicines in developing countries are substandard or falsified</p>
                    <p className="text-sm text-gray-500 mt-2">— WHO Report</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-red-600 mb-2">500,000</div>
                    <p className="text-gray-700">deaths per year in Africa alone from counterfeit medicines</p>
                    <p className="text-sm text-gray-500 mt-2">— UNODC Estimate</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="pt-6">
                    <div className="text-4xl font-bold text-red-600 mb-2">100+</div>
                    <p className="text-gray-700">countries affected by organized pharmaceutical crime</p>
                    <p className="text-sm text-gray-500 mt-2">— PSI Data</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Trust */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Real Data, Real Trust</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <Globe className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>Crustdata: Live Professional Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Real-time pharmacist profiles from LinkedIn, GitHub, and professional license databases.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">✓ Not mock data — actual profiles</p>
                    <p className="text-sm font-medium text-blue-900">✓ Geographic search within 50km</p>
                    <p className="text-sm font-medium text-blue-900">✓ Experience & credentials verified</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Blaxel: AI Agent Execution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Autonomous AI agents assign optimal pharmacists and issue tamper-proof Proof of Faith certificates.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">✓ Secure code execution environment</p>
                    <p className="text-sm font-medium text-purple-900">✓ Reduced centralized tampering risk</p>
                    <p className="text-sm font-medium text-purple-900">✓ Autonomous agency operation</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Three-Party Ecosystem */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Three-Party Ecosystem</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Building2 className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>Pharmaceutical Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Pay for CountFaith certification. Promote "Our medicines use CountFaith verification" to build trust and justify premium pricing.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle>Latent Pharmacists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Visit distribution sites to verify authenticity. Leverage professional qualifications for flexible, high-paying work with social impact.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle2 className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>Hospitals & Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Receive guaranteed effective medicines. Pay premium for CountFaith-certified drugs with proven authenticity and efficacy.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* YC RFS Alignment */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">YC Request for Startups 2026</h2>
              <Card className="border-orange-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-2 rounded">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">AI-Native Agency</h3>
                        <p className="text-gray-700">
                          CountFaith embodies YC's vision of software evolving from tools (SaaS) to autonomous agencies that complete tasks independently.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-2 rounded">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">AI for Government</h3>
                        <p className="text-gray-700">
                          Solving real-world physical challenges in pharmaceutical supply chains with AI + human expertise.
                        </p>
                      </div>
                    </div>
                    <a 
                      href="https://www.ycombinator.com/rfs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-orange-600 hover:text-orange-700 font-medium mt-2"
                    >
                      → View YC RFS 2026
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SDG Impact */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <Target className="w-12 h-12 text-blue-600" />
                <h2 className="text-3xl font-bold">SDG 3: Good Health and Well-being</h2>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Business Model</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <strong>Pharmaceutical companies pay</strong> for CountFaith certification to differentiate their products in the market.
                    </p>
                    <p>
                      <strong>Marketing advantage:</strong> "Our medicines are verified by CountFaith" becomes a powerful trust signal.
                    </p>
                    <p>
                      <strong>Premium pricing justified:</strong> Hospitals and patients pay more for guaranteed authentic, effective medicines.
                    </p>
                    <p className="text-blue-600 font-medium">
                      Result: Reduced counterfeit drugs → Better health outcomes → Contributing to UN SDG 3
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is pharmacist data private?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    We use Crustdata to access only publicly available professional profiles (LinkedIn, etc.). 
                    For actual deployment, we implement compliant onboarding processes following local regulations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Why not use AI alone?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Medicines are physical. Subtle packaging differences and dissolution reactions require expert intuition 
                    and responsibility that AI cameras alone cannot capture. Human expertise is the last mile that saves lives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Proof of Faith</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Immutable truth certificates issued with pharmacist digital signatures.<br />
              Complete traceability through Blaxel technology.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/inspections">Start Inspection</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/image.png" alt="CountFaith" width={24} height={24} className="rounded" />
            <span className="font-bold text-white">CountFaith</span>
          </div>
          <p>&copy; 2026 CountFaith. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
