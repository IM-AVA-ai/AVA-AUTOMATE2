"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  MessageSquare,
  Zap,
  BarChart3,
  Bot,
  Users,
  FileSpreadsheet,
  Bell,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "@/hooks/use-in-view"
import { useUser } from '@clerk/nextjs';
import { Spinner } from "@heroui/spinner";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [titleRef, titleInView] = useInView({ threshold: 0.3 })
  const [descRef, descInView] = useInView({ threshold: 0.3 })
  const [feature1Ref, feature1InView] = useInView({ threshold: 0.2 })
  const [feature2Ref, feature2InView] = useInView({ threshold: 0.2 })
  const [feature3Ref, feature3InView] = useInView({ threshold: 0.2 })
  const [feature4Ref, feature4InView] = useInView({ threshold: 0.2 })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="nav-container py-4 px-4 md:px-6 relative">
        <div className="absolute left-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-white/30 blur-[30px]"></div>
        </div>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/favicon.png" alt="IM AVA.ai Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-normal">
              IM AVA<span className="text-ava-purple5">.ai</span>
            </span>
          </div>

          <nav className="hidden md:block">
            <div className="nav-center">
              <Link href="#home" className="nav-link active">
                Home
              </Link>
              <Link href="#features" className="nav-link">
                Features
              </Link>
              <Link href="#customers" className="nav-link">
                Customers
              </Link>
              <Link href="#about" className="nav-link">
                About Us
              </Link>
              <Link href="#integrations" className="nav-link">
                Integrations
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Spinner size="sm" variant="wave" />
            {!isLoaded ? (<Spinner size="sm" variant="wave" />) : (isSignedIn ? (
              <Button className="bg-ava-purple5 hover:bg-ava-purple4 rounded-full" onClick={() => router.push('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" className="hidden md:flex text-gray-400 hover:text-white hover:bg-transparent" onClick={() => router.push('/sign-in')}>
                  Sign In
                </Button>
                <Button className="bg-ava-purple5 hover:bg-ava-purple4 rounded-full" onClick={() => router.push('/sign-up')}>Sign Up</Button>
              </>
            ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-24 px-4 md:px-6 relative grid-bg plus-bg plus-bg-tl plus-bg-br overflow-hidden">
        <div className="animated-gradient"></div>
        <div className="noise-texture"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-ava-darkpurple3/30 border border-ava-darkpurple4/50 text-sm">
            <span className="text-ava-purple5">Introducing IM AVA.ai</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-normal mb-6 leading-tight">
            Meet Ava: <br />
            <span className="gradient-text">Effortless Lead Qualification with AI</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Automate personalized conversations and get instant responses.
            Ava helps you scale your outreach while keeping leads engaged and qualified.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-ava-purple5 hover:bg-ava-purple4 rounded-full text-base py-6 px-8">
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-800 text-gray-300 hover:bg-gray-900 hover:text-white rounded-full text-base py-6 px-8"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl opacity-70 pointer-events-none">
          <div className="w-full h-[600px] rounded-full bg-ava-darkpurple4/30 blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-ava-darkpurple3/30 border border-ava-darkpurple4/50 text-sm">
            <span className="text-ava-purple5">Core Features</span>
          </div>

          <div ref={titleRef} className={`invisible-until-animated ${titleInView ? "animate-fade-in-up" : ""}`}>
            <h2 className="text-4xl md:text-6xl font-normal mb-6">
              Streamline Your <br />
              Lead Communication <br />
              With AI
            </h2>
          </div>

          <div
            ref={descRef}
            className={`invisible-until-animated ${descInView ? "animate-fade-in-up animate-delay-200" : ""}`}
          >
            <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto">
              IM AVA combines powerful AI with SMS technology to help businesses engage with leads efficiently and
              effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div ref={feature1Ref} className={`invisible-until-animated ${feature1InView ? "animate-scale-in" : ""}`}>
              <FeatureItemEnhanced
                icon={<Users className="h-6 w-6 text-ava-purple5" />}
                title="Lead Management"
                description="Import leads via CSV or add them manually. Segment and target specific groups for personalized campaigns."
              />
            </div>

            <div
              ref={feature2Ref}
              className={`invisible-until-animated ${feature2InView ? "animate-scale-in animate-delay-100" : ""}`}
            >
              <FeatureItemEnhanced
                icon={<Bot className="h-6 w-6 text-ava-purple5" />}
                title="AI Assistants"
                description="Industry-specific AI assistants craft personalized messages to engage and qualify leads automatically."
              />
            </div>

            <div
              ref={feature3Ref}
              className={`invisible-until-animated ${feature3InView ? "animate-scale-in animate-delay-200" : ""}`}
            >
              <FeatureItemEnhanced
                icon={<MessageSquare className="h-6 w-6 text-ava-purple5" />}
                title="SMS Campaigns"
                description="Create and launch SMS campaigns with ease. Track results and status updates in real-time via Twilio integration."
              />
            </div>

            <div
              ref={feature4Ref}
              className={`invisible-until-animated ${feature4InView ? "animate-scale-in animate-delay-300" : ""}`}
            >
              <FeatureItemEnhanced
                icon={<Zap className="h-6 w-6 text-ava-purple5" />}
                title="Real-Time Messaging"
                description="Support two-way conversations with seamless, continuous interactions between leads and your business."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto py-24 px-4 md:px-6 relative grid-bg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-ava-darkpurple3/30 border border-ava-darkpurple4/50 text-sm">
            <span className="text-ava-purple5">How It Works</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-normal mb-10">
            Automate Your <br />
            Lead Communication
          </h2>

          <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
            IM AVA simplifies the process of lead qualification, message sending, and follow-up conversations, using AI
            assistants to handle the bulk of the communication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <WorkflowStep
              number="01"
              title="Import & Segment Leads"
              description="Upload your leads via CSV or add them manually. Organize them into segments for targeted campaigns."
            />
            <WorkflowStep
              number="02"
              title="Select AI Assistant"
              description="Choose the industry-specific AI assistant that best matches your business needs and campaign goals."
            />
            <WorkflowStep
              number="03"
              title="Launch & Monitor"
              description="Start your campaign and watch as the AI engages with leads, qualifies them, and manages conversations."
            />
          </div>

          <div className="relative bg-gradient-to-b from-transparent to-black/80 rounded-xl p-1 mb-8">
            <div className="bg-black/80 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-12 bg-ava-purple3 rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400">SMS Campaign Dashboard</p>
                </div>
              </div>
            </div>
          </div>

          <Button className="bg-ava-purple5 hover:bg-ava-purple4 rounded-full text-base py-6 px-8">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="container mx-auto py-24 px-4 md:px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-ava-darkpurple3/30 border border-ava-darkpurple4/50 text-sm">
              <span className="text-ava-purple5">More Features</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-normal mb-6">Everything You Need for SMS Lead Engagement</h2>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              IM AVA provides a comprehensive suite of tools to manage your lead communication from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Bell className="h-6 w-6 text-ava-purple5" />}
              title="Automated Follow-ups"
              description="Automatically manage follow-up messages based on lead responses, ensuring no opportunity is missed."
            />

            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-ava-purple5" />}
              title="Performance Tracking"
              description="Monitor campaign performance with detailed analytics on message delivery, response rates, and lead qualification."
            />

            <FeatureCard
              icon={<FileSpreadsheet className="h-6 w-6 text-ava-purple5" />}
              title="Error Handling"
              description="Robust error handling tracks failed message deliveries or issues with assistants, allowing for quick corrective action."
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6 text-ava-purple5" />}
              title="Real-Time Notifications"
              description="Receive notifications for key actions like message delivery, lead replies, or campaign completion."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-ava-darkpurple3/30 border border-ava-darkpurple4/50 text-sm">
            <span className="text-ava-purple5">Use Cases</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-normal mb-6">Who Uses IM AVA?</h2>

          <p className="text-lg text-gray-400">
            IM AVA is designed for businesses of all sizes that want to streamline their lead communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UseCaseCard
            industry="Solar Energy"
            description="Solar companies use IM AVA to qualify leads, answer common questions about installation and pricing, and schedule consultations."
          />

          <UseCaseCard
            industry="Roofing Services"
            description="Roofing contractors use IM AVA to follow up with leads after estimates, provide information about materials, and coordinate project timelines."
          />

          <UseCaseCard
            industry="Real Estate"
            description="Real estate agents use IM AVA to engage with potential buyers and sellers, answer property questions, and schedule viewings."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-24 px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-ava-darkpurple4 to-ava-purple5 opacity-90"></div>
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-normal mb-6">Ready to Transform Your Lead Engagement?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join businesses that are automating their SMS communication with IM AVA.ai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-ava-darkpurple4 hover:bg-gray-100 rounded-full text-base py-6 px-8">
                Start Your Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full text-base py-6 px-8"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 md:px-6 border-t border-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/im-ava-logo.png"
                  alt="IM AVA.ai Logo"
                  width={24}
                  height={24}
                  className="h-5 w-auto"
                />
                <span className="text-lg font-normal">
                  IM AVA<span className="text-ava-purple5">.ai</span>
                </span>
              </div>
              <p className="text-gray-400 mb-4">AI-powered SMS communication platform for businesses.</p>
              <div className="flex space-x-4">
                <SocialIcon />
                <SocialIcon />
                <SocialIcon />
                <SocialIcon />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-normal mb-4">Product</h3>
              <ul className="space-y-2">
                <FooterLink href="#features" label="Features" />
                <FooterLink href="#pricing" label="Pricing" />
                <FooterLink href="#" label="Integrations" />
                <FooterLink href="#" label="Case Studies" />
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-normal mb-4">Resources</h3>
              <ul className="space-y-2">
                <FooterLink href="#" label="Documentation" />
                <FooterLink href="#" label="Blog" />
                <FooterLink href="#" label="Tutorials" />
                <FooterLink href="#" label="Support" />
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-normal mb-4">Company</h3>
              <ul className="space-y-2">
                <FooterLink href="#" label="About Us" />
                <FooterLink href="#" label="Careers" />
                <FooterLink href="#" label="Contact" />
                <FooterLink href="#" label="Privacy Policy" />
                <FooterLink href="#" label="Terms of Service" />
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} IM AVA.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-normal mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-black border border-gray-800 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-ava-darkpurple3/30 mr-4 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-normal">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}

function WorkflowStep({ number, title, description }) {
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-ava-purple5 font-normal">{number}</span>
      </div>
      <h3 className="text-xl font-normal mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function UseCaseCard({ industry, description }) {
  return (
    <Card className="bg-black border border-gray-800 overflow-hidden">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center mb-4">
          <Bot className="h-6 w-6 text-ava-purple5" />
        </div>
        <h4 className="text-xl font-normal mb-3">{industry}</h4>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  )
}

function SocialIcon() {
  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-ava-purple5 hover:border-ava-purple5 transition-colors"
    >
      <ArrowUpRight className="h-4 w-4" />
    </a>
  )
}

function FooterLink({ href, label }) {
  return (
    <li>
      <a href={href} className="text-gray-400 hover:text-ava-purple5 transition-colors">
        {label}
      </a>
    </li>
  )
}

function FeatureItemEnhanced({ icon, title, description }) {
  return (
    <div className="relative group">
      {/* Background decorative elements */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-ava-darkpurple4 to-ava-purple5 opacity-0 group-hover:opacity-20 rounded-lg blur transition duration-300"></div>
      <div className="absolute right-0 top-0 h-20 w-20 bg-ava-purple5/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative bg-black border border-gray-800 hover:border-ava-darkpurple4/50 p-6 rounded-lg transition-all duration-300 text-left">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center group-hover:bg-ava-darkpurple4/40 transition-colors duration-300">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-normal mb-2 group-hover:text-ava-purple5 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute transform rotate-45 bg-ava-purple5/10 w-4 h-4 -bottom-2 -right-2"></div>
        </div>
      </div>
    </div>
  )
}
