import { ServiceItem, AwarenessTopic, GalleryItem } from './types';

// Let's create an alias for Testimonial to make sure it matches Review
import { Review as TestimonialType } from './types';

export const CLINIC_INFO = {
  name: "A K Clinic",
  tagline: "Quality Healthcare with Compassion & Care",
  location: "OPD Clinic in Karachi, Pakistan",
  address: "Hijri Road near Sania Tower, opposite Incholi Society Gate, Karachi, Pakistan 76000",
  phones: ["+92 78 25 92 30", "+92 327 8259230"],
  email: "a.k.clinicofficial@gmail.com",
  whatsapp: "+923278259230",
  whatsappLink: "https://wa.me/923278259230",
  googleMapsQuery: "Hijri Road near Sania Tower opposite Incholi Society Gate Karachi Pakistan",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9023348123284!2d67.0782354!3d24.9354085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f67a2cb69df%3A0xc66cbb41132ba065!2sSania%20Tower%2C%20Block%2014%20Gulberg%20Town%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk",
  hours: [
    { days: "Monday - Saturday", hours: "05:00 PM - 09:30 PM" },
    { days: "Sunday", hours: "Closed" }
  ]
};

export const SERVICES: ServiceItem[] = [
  {
    id: "general-opd",
    title: "General OPD Consultation",
    description: "Expert diagnosis and comprehensive treatment for acute and chronic common health concerns.",
    details: [
      "Common seasonal fevers and flu",
      "Gastrointestinal disorders & infections",
      "Chronic health management guidance",
      "Prescription management & health education"
    ],
    iconName: "Stethoscope"
  },
  {
    id: "bp-monitoring",
    title: "Blood Pressure Monitoring",
    description: "Free professional blood pressure assessments before every consultation to monitor your cardiovascular health.",
    details: [
      "Complementary pre-consultation assessment",
      "Hypertension screening and monitoring",
      "Patient education on sodium reduction and diet",
      "Digital & manual mercury-free sphygmomanometer checks"
    ],
    iconName: "Activity"
  },
  {
    id: "weight-assessment",
    title: "Weight Assessment",
    description: "Routine weight monitoring and BMI tracking to guide wellness, physical growth, and therapeutic nutrition.",
    details: [
      "Accurate pre-consultation weight checks",
      "Growth tracking for toddlers and children",
      "Body weight management tips",
      "Correlation of weight changes with cardiovascular health"
    ],
    iconName: "Scale"
  },
  {
    id: "pulse-check",
    title: "Pulse Check-Up",
    description: "Complimentary heart rate and pulse assessment before doctor consultation for vital stability checks.",
    details: [
      "Pulse rhythm evaluation",
      "Resting heart rate tracking",
      "Immediate detection of tachycardia or bradycardia",
      "Vital stability log for medical charts"
    ],
    iconName: "Heart"
  },
  {
    id: "pediatric-health",
    title: "Pediatric Health Guidance",
    description: "Compassionate child wellness tracking, developmental milestone supervision, and nutritional counseling for infants and children.",
    details: [
      "Growth & nutritional counseling",
      "Infant dietary guidelines",
      "Developmental milestones education",
      "Common childhood infections treatment"
    ],
    iconName: "Baby"
  },
  {
    id: "respiratory-care",
    title: "Respiratory Health Care",
    description: "Specialized clinical diagnosis and management for common acute respiratory concerns and chest infections.",
    details: [
      "Bronchitis clinical evaluation",
      "Persistent cough and throat infection management",
      "Asthma and breathing difficulty consultation",
      "Nebulization reference and oxygen evaluation"
    ],
    iconName: "Wind"
  },
  {
    id: "preventive-healthcare",
    title: "Preventive Healthcare",
    description: "Routine health awareness, lifestyle education, and early screening to prevent chronic conditions.",
    details: [
      "Dietary and physical activity advice",
      "Early warning signs coaching",
      "Geriatric wellness tracking",
      "Hygiene and disease prevention guidelines"
    ],
    iconName: "ShieldAlert"
  },
  {
    id: "follow-up",
    title: "Follow-up Consultations",
    description: "Continuous monitoring of recovery progress, diagnostic report review, and therapy adjustments.",
    details: [
      "Lab report analysis and discussion",
      "Treatment response observation",
      "Prescription review and refinement",
      "Long-term wellness tracking"
    ],
    iconName: "CalendarClock"
  }
];

export const TESTIMONIALS: TestimonialType[] = [
  {
    id: "rev-1",
    name: "Ahmed K.",
    rating: 5,
    comment: "The clinic environment is very clean and the staff is cooperative. Highly recommended.",
    date: "2026-06-15",
    verified: true
  },
  {
    id: "rev-2",
    name: "Sana M.",
    rating: 5,
    comment: "I appreciated the free blood pressure and weight check before my consultation. It feels very professional.",
    date: "2026-06-28",
    verified: true
  },
  {
    id: "rev-3",
    name: "Bilal R.",
    rating: 5,
    comment: "Professional service and smooth appointment process. The doctor listened very patiently.",
    date: "2026-07-02",
    verified: true
  },
  {
    id: "rev-4",
    name: "Hina A.",
    rating: 5,
    comment: "The doctor listened carefully and explained everything clearly. Very clean facility near Incholi.",
    date: "2026-07-05",
    verified: true
  }
];

export const AWARENESS_TOPICS: AwarenessTopic[] = [
  {
    id: "topic-1",
    title: "Child Development Awareness",
    category: "Pediatric Health",
    summary: "Understanding healthy physical, cognitive, and social developmental milestones in children.",
    content: [
      "Developmental milestones are behaviors and physical skills seen in infants and children as they grow. Sucking, rolling, crawling, walking, and talking are all developmental milestones.",
      "During early childhood (ages 1 to 5), monitor physical markers (height and weight), motor skills, and social interaction. Ensuring your child gets nutrition rich in vitamins, calcium, and proteins is critical for brain growth.",
      "At A K Clinic, we offer routine pediatric health tracking and nutritional guidance to ensure your child hits these crucial milestones healthily."
    ],
    readTime: "4 min read",
    iconName: "Baby"
  },
  {
    id: "topic-2",
    title: "Respiratory Health & Bronchitis",
    category: "Chest Care",
    summary: "Recognizing early symptoms of bronchitis, respiratory infections, and when to seek urgent OPD care.",
    content: [
      "Bronchitis is an inflammation of the lining of your bronchial tubes, which carry air to and from your lungs. It often develops from a cold or other respiratory infection.",
      "Key symptoms include a persistent cough, production of mucus (sputum), fatigue, shortness of breath, and slight fever or chest discomfort. Acute bronchitis usually improves within a week to 10 days.",
      "Protect your lungs by avoiding cigarette smoke, dust, air pollution, and washing hands regularly to prevent virus transmission. Consult our respiratory specialists if your cough persists more than 3 weeks."
    ],
    readTime: "5 min read",
    iconName: "Wind"
  },
  {
    id: "topic-3",
    title: "Blood Pressure Awareness",
    category: "Cardiovascular",
    summary: "The silent threat: Why regular blood pressure screening is essential for adults of all ages.",
    content: [
      "High blood pressure (hypertension) often has no symptoms but can cause serious health damage, including heart attack, stroke, and kidney failure. This is why it is often called a 'silent killer.'",
      "A healthy blood pressure reading is generally below 120/80 mmHg. Keeping track of your blood pressure takes less than two minutes but can save your life.",
      "We believe so strongly in early detection that A K Clinic provides a complimentary blood pressure, weight, and pulse assessment to every patient prior to their doctor consultation."
    ],
    readTime: "3 min read",
    iconName: "Activity"
  },
  {
    id: "topic-4",
    title: "Healthy Lifestyle Tips",
    category: "Preventive Care",
    summary: "Simple, highly actionable daily habits for better long-term immunity and metabolic health.",
    content: [
      "Small changes can have a huge impact on your longevity and energy levels. Start with simple physical activity: a 20-minute daily walk can decrease cardiovascular risks by up to 30%.",
      "Hydration is key. Drinking 8 to 10 glasses of clean water daily supports digestion, metabolic function, and keeps your skin and joints healthy.",
      "Reduce processed sugar and sodium intake. Include seasonal green vegetables, fiber-rich whole grains, and lean proteins in your daily meals to build a robust immune defense."
    ],
    readTime: "4 min read",
    iconName: "Heart"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Premium Clinic Exterior",
    category: "Clinic Exterior",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    altText: "A K Clinic modern welcoming main entrance in Karachi"
  },
  {
    id: "gal-2",
    title: "Patient Reception & Registration",
    category: "Reception Area",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200",
    altText: "Hygienic and spacious patient reception desk"
  },
  {
    id: "gal-3",
    title: "Comfortable OPD Waiting Lounge",
    category: "Patient Facilities",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200",
    altText: "Comfortable clinical waiting lounge designed for patient wellbeing"
  },
  {
    id: "gal-4",
    title: "Doctor's Private Consultation Chamber",
    category: "Consultation Area",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=1200",
    altText: "Equipped doctor consultation room for personalized check-ups"
  },
  {
    id: "gal-5",
    title: "Free Vital Signs Station",
    category: "Patient Facilities",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    altText: "Vital sign check-up corner for complimentary blood pressure, heart rate and weight checks"
  },
  {
    id: "gal-6",
    title: "Community Health Awareness Drive",
    category: "Health Awareness Activities",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200",
    altText: "Clinical health awareness seminar and vital monitoring guidance"
  }
];

export const FAQS = [
  {
    question: "Do I need an appointment?",
    answer: "Yes, A K Clinic operates on an appointment-based outpatient model to ensure minimal waiting times and full medical attention. Walk-in emergencies are addressed promptly, but pre-booking is highly recommended."
  },
  {
    question: "Is blood pressure checking free?",
    answer: "Absolutely! We conduct complimentary pre-consultation vital assessments (including blood pressure monitoring, heart rate pulse assessment, and weight check) for all registered patients to support comprehensive clinical records."
  },
  {
    question: "Do you offer weight monitoring?",
    answer: "Yes. Routine weight checks and BMI assessments are offered completely free of charge before your doctor's consultation, helping track wellness trends and pediatric development milestones."
  },
  {
    question: "Do you provide child healthcare guidance?",
    answer: "Yes, our general practitioner specializes in community medicine, offering dedicated pediatric wellness guidance, dietary tracking, growth charts, and early childhood infection screening."
  },
  {
    question: "What respiratory conditions do you address?",
    answer: "We treat and consult on a wide array of acute and chronic respiratory issues, including seasonal bronchitis, allergic coughs, flu infections, bronchial breathing difficulties, and mild chest congestion."
  },
  {
    question: "What are your clinic timings?",
    answer: "The clinic is open from Monday to Saturday, between 05:00 PM and 09:30 PM. We are closed on Sundays."
  }
];
