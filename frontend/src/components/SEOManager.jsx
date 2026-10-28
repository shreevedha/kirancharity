import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const metaByPath = {
    '/': {
        title: 'Kiran Charitable Trust | Official NGO Website | 80G & 12A Certified (Guntur, AP)',
        description: 'Official website of Kiran Charitable Trust (PAN: AAGTK5575Q, 80G URN: AAGTK5575QF20261). Empowering rural communities across Guntur & Palnadu districts, Andhra Pradesh through education, healthcare, and food distribution.',
        keywords: 'Kiran Charitable Trust, Kiran Trust Guntur, NGO Palnadu, 80G Tax Exemption, 12A Certified NGO, Pallepogu Kiranbabu, Donate Online India, Canara Bank Charitable Trust, www.kirancharitabletrust.org'
    },
    '/donate': {
        title: 'Donate Online | 80G Tax Exemption Receipts | Kiran Charitable Trust',
        description: 'Make an online donation to Kiran Charitable Trust. Instant 80G tax deduction receipts. Supports UPI, Cards, NetBanking, and Direct Canara Bank Transfer (A/C: 110319653482, IFSC: CNRB0002492).',
        keywords: 'Donate Kiran Trust, 80G Tax Deduction, Online Charity Donation India, Canara Bank NGO Guntur, UPI QR Donation Kiran Trust'
    },
    '/about': {
        title: 'About Us | Kiran Charitable Trust | Board of Trustees & 12A/80G Documents',
        description: 'Learn about Kiran Charitable Trust, our vision, mission, and leadership team under Chairman Pallepogu Kiranbabu. View verified 12A, 80G, and PAN government documents.',
        keywords: 'About Kiran Charitable Trust, Pallepogu Kiranbabu, Board of Trustees, 12A 80G Approved NGO Andhra Pradesh, Guntur Charity'
    },
    '/founder-desk': {
        title: "Founder's Desk | Pallepogu Kiranbabu (Chairman) | Kiran Charitable Trust",
        description: "Read the founding message from Chairman Pallepogu Kiranbabu. Discover our commitment to serving underprivileged families and children across Guntur & Palnadu.",
        keywords: "Pallepogu Kiranbabu, Chairman Kiran Charitable Trust, NGO Founder Message, Social Reformer Andhra Pradesh"
    },
    '/activities': {
        title: 'Our Programs & Social Work | Kiran Charitable Trust | Guntur & Palnadu',
        description: 'Explore our charitable activities: rural student scholarships, free medical and diagnostics camps, monthly food distribution drives, and women empowerment.',
        keywords: 'Kiran Trust Activities, Medical Camps Guntur, Food Relief Palnadu, Student Support Andhra Pradesh'
    },
    '/gallery': {
        title: 'Field Photo Gallery & Proof of Work | Kiran Charitable Trust',
        description: 'Verified photographs of our on-ground food distribution, blood donation camps, school supply drives, and community welfare programs across Andhra Pradesh.',
        keywords: 'Kiran Charitable Trust Photos, Field Work Gallery, Charity Events Proof, Guntur NGO Activities'
    },
    '/volunteers': {
        title: 'Join as Volunteer or Team Member | Kiran Charitable Trust',
        description: 'Be part of a compassionate humanitarian movement. Apply to volunteer or work with Kiran Charitable Trust across Guntur & Palnadu districts.',
        keywords: 'Volunteer Kiran Trust, NGO Careers Andhra Pradesh, Social Work Guntur, Join NGO India'
    },
    '/careers': {
        title: 'Careers & Volunteering Opportunities | Kiran Charitable Trust',
        description: 'Be part of a compassionate humanitarian movement. Apply to volunteer or work with Kiran Charitable Trust across Guntur & Palnadu districts.',
        keywords: 'Volunteer Kiran Trust, NGO Careers Andhra Pradesh, Social Work Guntur, Join NGO India'
    },
    '/contact': {
        title: 'Contact Us | Kiran Charitable Trust | Guntur, Andhra Pradesh',
        description: 'Get in touch with Kiran Charitable Trust: Mandepudi Post, Amaravathi Mandal, Palnadu / Guntur - 522018. Phone: +91 7702468889, Email: contact@kirancharitabletrust.org.',
        keywords: 'Contact Kiran Charitable Trust, NGO Phone Number Guntur, Amaravathi Charity Address, contact@kirancharitabletrust.org'
    },
    '/privacy-policy': {
        title: 'Privacy Policy | Kiran Charitable Trust',
        description: 'Privacy Policy and data protection guidelines of Kiran Charitable Trust. We respect and safeguard all donor information with strict confidentiality.',
        keywords: 'Privacy Policy Kiran Charitable Trust, Donor Privacy, Security Standards'
    },
    '/terms-conditions': {
        title: 'Terms & Conditions | Kiran Charitable Trust',
        description: 'Terms and Conditions for donations, volunteering, and use of services at Kiran Charitable Trust, Guntur, Andhra Pradesh.',
        keywords: 'Terms and Conditions Kiran Trust, Donation Policy, Refund Policy'
    },
    '/causes/education': {
        title: 'Child Education & Scholarships | Kiran Charitable Trust',
        description: 'Providing school kits, stationery, and education scholarships to rural underprivileged students across Guntur & Palnadu.',
        keywords: 'Child Education Charity, School Kits Donation, Rural Scholarships Guntur'
    },
    '/causes/healthcare': {
        title: 'Free Healthcare & Diagnostic Camps | Kiran Charitable Trust',
        description: 'Organizing free medical checkups, blood sugar screenings, and essential medicines distribution for underprivileged families and elders.',
        keywords: 'Free Medical Camps Guntur, Healthcare NGO Andhra Pradesh, Medicine Distribution'
    },
    '/causes/food-distribution': {
        title: 'Food Distribution & Hunger Relief | Kiran Charitable Trust',
        description: 'Distributing cooked meals and dry grocery kits (Rice, Dal, Oil) to daily wage earners and impoverished families in Guntur & Palnadu.',
        keywords: 'Food Distribution NGO, Hunger Relief Guntur, Grocery Kits Donation'
    },
    '/causes/women-empowerment': {
        title: 'Women Empowerment & Skill Development | Kiran Charitable Trust',
        description: 'Vocational training, tailoring machine courses, and self-help group programs to empower women towards financial independence.',
        keywords: 'Women Empowerment NGO, Skill Training Guntur, Tailoring Machines Charity'
    },
    '/causes/senior-citizens': {
        title: 'Senior Citizen Care & Old Age Support | Kiran Charitable Trust',
        description: 'Monthly visits to old age homes, medical support, nutrition, and companionship for abandoned and destitute elderly citizens.',
        keywords: 'Old Age Care NGO, Senior Citizen Support Guntur, Elder Care Andhra Pradesh'
    },
    '/causes/disaster-relief': {
        title: 'Emergency Flood & Disaster Relief | Kiran Charitable Trust',
        description: 'Immediate relief kits, dry rations, and medical aid during seasonal flooding and natural emergencies across Andhra Pradesh.',
        keywords: 'Disaster Relief NGO, Flood Relief Andhra Pradesh, Emergency Aid Guntur'
    },
    '/causes/blood-donation': {
        title: 'Voluntary Blood Donation Drives | Kiran Charitable Trust',
        description: 'Organizing voluntary blood camps in partnership with licensed blood banks to save lives during critical medical emergencies.',
        keywords: 'Blood Donation Camp Guntur, Voluntary Blood Donors, Save Lives Blood Camp'
    },
    '/causes/animal-welfare': {
        title: 'Animal Welfare & Stray Feeding | Kiran Charitable Trust',
        description: 'Daily stray feeding, rescue coordination, and medical treatment for injured stray dogs and animals across our operational hubs.',
        keywords: 'Animal Welfare NGO, Stray Dog Feeding Guntur, Animal Rescue Andhra Pradesh'
    }
}

export default function SEOManager() {
    const location = useLocation()

    useEffect(() => {
        const path = location.pathname
        const meta = metaByPath[path] || metaByPath['/']

        // Update Title
        document.title = meta.title

        // Update Description
        let descTag = document.querySelector('meta[name="description"]')
        if (!descTag) {
            descTag = document.createElement('meta')
            descTag.setAttribute('name', 'description')
            document.head.appendChild(descTag)
        }
        descTag.setAttribute('content', meta.description)

        // Update Keywords
        let keyTag = document.querySelector('meta[name="keywords"]')
        if (!keyTag) {
            keyTag = document.createElement('meta')
            keyTag.setAttribute('name', 'keywords')
            document.head.appendChild(keyTag)
        }
        keyTag.setAttribute('content', meta.keywords)

        // Update Canonical
        let canonicalTag = document.querySelector('link[rel="canonical"]')
        if (!canonicalTag) {
            canonicalTag = document.createElement('link')
            canonicalTag.setAttribute('rel', 'canonical')
            document.head.appendChild(canonicalTag)
        }
        canonicalTag.setAttribute('href', `https://www.kirancharitabletrust.org${path === '/' ? '' : path}`)

        // Update OpenGraph
        const setOgTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`)
            if (!tag) {
                tag = document.createElement('meta')
                tag.setAttribute('property', property)
                document.head.appendChild(tag)
            }
            tag.setAttribute('content', content)
        }

        setOgTag('og:title', meta.title)
        setOgTag('og:description', meta.description)
        setOgTag('og:url', `https://www.kirancharitabletrust.org${path === '/' ? '' : path}`)
        setOgTag('og:image', 'https://www.kirancharitabletrust.org/og-image.jpg')

        // Update Twitter
        const setTwitterTag = (name, content) => {
            let tag = document.querySelector(`meta[name="${name}"]`)
            if (!tag) {
                tag = document.createElement('meta')
                tag.setAttribute('name', name)
                document.head.appendChild(tag)
            }
            tag.setAttribute('content', content)
        }

        setTwitterTag('twitter:title', meta.title)
        setTwitterTag('twitter:description', meta.description)
        setTwitterTag('twitter:image', 'https://www.kirancharitabletrust.org/og-image.jpg')
    }, [location])

    return null
}
