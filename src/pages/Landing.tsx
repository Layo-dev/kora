import { Button } from "@/components/ui/button";
import { Heart, Mail, ChevronRight, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import profile5 from "@/assets/profile-5.jpg";
import profile6 from "@/assets/profile-6.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto">
          <span className="text-2xl font-rounded font-extrabold text-rose-500 lowercase">kora</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-violet-50">
        <div className="container mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-rose-500">Date with</span>
                <br />
                <span className="text-rose-500">confidence</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                Join millions of people finding meaningful connections on Kora. Start your journey today.
              </p>
              
              <div className="space-y-3 max-w-sm">
                <Button className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-full gap-2">
                  <Mail className="w-5 h-5" />
                  Sign up with email
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-full gap-2 border-border">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-full gap-2 border-border">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>
            </div>
            
            {/* Right Content - Profile Photos */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                {/* Purple decorative shape */}
                <div className="absolute top-10 right-0 w-80 h-96 bg-violet-400 rounded-[60px] transform rotate-12" />
                
                {/* Profile photos */}
                <div className="absolute top-0 left-20 w-48 h-64 rounded-3xl overflow-hidden shadow-xl transform -rotate-6 z-10">
                  <img src={profile1} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-20 right-20 w-48 h-64 rounded-3xl overflow-hidden shadow-xl transform rotate-6 z-20">
                  <img src={profile2} alt="User" className="w-full h-full object-cover" />
                </div>
                
                {/* Heart icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                  <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confidence Section */}
      <section className="bg-violet-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Illustration placeholder */}
            <div className="relative h-80 lg:h-[400px] bg-violet-200 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-300 to-violet-400" />
              <div className="relative z-10 flex gap-4">
                <div className="w-24 h-32 bg-white/30 backdrop-blur rounded-2xl transform -rotate-12" />
                <div className="w-24 h-32 bg-white/30 backdrop-blur rounded-2xl transform rotate-12" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                We're all about confidence.
              </h2>
              <p className="text-muted-foreground text-lg">
                We're built different. We believe everyone deserves to feel confident when connecting with others. That's why we've created features that put you in control.
              </p>
              <p className="text-muted-foreground">
                From verified profiles to our unique matching algorithm, every feature is designed to help you put your best foot forward.
              </p>
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 h-12">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Chat Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="space-y-6 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to chat?
              </h2>
              <p className="text-muted-foreground text-lg">
                Browse profiles, find your match, and start chatting. Our intuitive interface makes it easy to connect with people who share your interests.
              </p>
              <p className="text-muted-foreground">
                With real-time messaging and smart suggestions, you'll never run out of things to talk about.
              </p>
            </div>
            
            {/* Phone mockup with profile grid */}
            <div className="relative lg:order-2">
              <div className="relative mx-auto w-72 h-[500px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[profile1, profile2, profile3, profile4, profile5, profile6].map((img, i) => (
                      <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden">
                        <img src={img} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative hearts */}
              <div className="absolute -top-4 -right-4 w-12 h-12 text-rose-400">
                <Heart className="w-full h-full" fill="currentColor" />
              </div>
              <div className="absolute bottom-20 -left-8 w-8 h-8 text-violet-400">
                <Heart className="w-full h-full" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet People Section */}
      <section className="py-20 bg-violet-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Large profile with floating tags */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
                  <img src={profile3} alt="Featured profile" className="w-full h-full object-cover" />
                </div>
                
                {/* Floating intent tags */}
                <div className="absolute top-8 -right-4 bg-white rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium">Looking for love 💕</span>
                </div>
                <div className="absolute top-24 -left-4 bg-white rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium">Coffee dates ☕</span>
                </div>
                <div className="absolute bottom-32 -right-8 bg-white rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium">Adventure seeker 🌍</span>
                </div>
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Meet people who want the same things
              </h2>
              <p className="text-muted-foreground text-lg">
                Whether you're looking for something casual or ready for a serious relationship, you'll find people with the same intentions.
              </p>
              <p className="text-muted-foreground">
                Our dating intentions feature helps you connect with people who are on the same page, saving time and avoiding awkward conversations.
              </p>
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 h-12">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kora Success Stories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people who found their match on Kora
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { name: "Sarah & Mike", quote: "We matched on Kora two years ago and just got engaged! The app made it so easy to find someone who shared my values." },
              { name: "Jessica & Tom", quote: "I was skeptical about online dating, but Kora changed my mind. Tom and I connected instantly over our love of hiking." },
              { name: "Emma & James", quote: "The confidence features on Kora helped me feel safe while dating. Now I'm happily married to my perfect match!" }
            ].map((story, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-violet-500" fill="currentColor" />
                  </div>
                  <span className="font-semibold text-foreground">{story.name}</span>
                </div>
                <p className="text-muted-foreground italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
          
          <div className="text-center space-y-4">
            <Link to="#" className="text-violet-600 hover:underline inline-flex items-center gap-1">
              Check out more success stories
              <ChevronRight className="w-4 h-4" />
            </Link>
            <div>
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 h-12">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-violet-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Stats */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Trusted by millions worldwide
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold">50M+</div>
                  <div className="text-violet-200">Active users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">1B+</div>
                  <div className="text-violet-200">Matches made</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">190+</div>
                  <div className="text-violet-200">Countries</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4.5★</div>
                  <div className="text-violet-200">App Store rating</div>
                </div>
              </div>
            </div>
            
            {/* Illustration placeholder */}
            <div className="relative h-80 bg-violet-500 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="flex gap-4 transform rotate-6">
                <div className="w-32 h-40 rounded-2xl overflow-hidden shadow-lg">
                  <img src={profile4} alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="w-32 h-40 rounded-2xl overflow-hidden shadow-lg -mt-8">
                  <img src={profile5} alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-xl font-bold">Kora</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Date with confidence. Find your perfect match.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-background">About Us</Link></li>
                <li><Link to="#" className="hover:text-background">Careers</Link></li>
                <li><Link to="#" className="hover:text-background">Press</Link></li>
                <li><Link to="#" className="hover:text-background">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-background">Safety Tips</Link></li>
                <li><Link to="#" className="hover:text-background">Dating Advice</Link></li>
                <li><Link to="#" className="hover:text-background">Success Stories</Link></li>
                <li><Link to="#" className="hover:text-background">Help Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link to="#" className="hover:text-background">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-background">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-background">Cookie Policy</Link></li>
                <li><Link to="#" className="hover:text-background">Community Guidelines</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Kora. All rights reserved.
            </p>
            <Button variant="ghost" className="text-muted-foreground hover:text-background gap-2">
              <Globe className="w-4 h-4" />
              English
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
