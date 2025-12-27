import Hero from "@/components/functional/landing/hero";
import { Navbar } from "@/components/navbar";
import Features from "@/components/functional/landing/features";
import Footer from "@/components/functional/landing/footer";
import CTABanner from "@/components/functional/landing/cta-banner";
import Pricing from "@/components/functional/landing/pricing";
import FAQ from "@/components/functional/landing/faq";
import Testimonials from "@/components/functional/landing/testimonials";

export default function Page() {
    return (
        <>
            <Navbar />
            <main className="pt-16 xs:pt-20 sm:pt-24">
                <Hero />
                <Features />
                <Pricing />
                <FAQ />
                <Testimonials />
                <CTABanner />
                <Footer />
            </main>
        </>
    )
}
