import type { ImageMetadata } from 'astro';
import sandyCaregiverPhoto from '../assets/benefits/Sandy-Tubman-and-Caregiver-Picture-Light-Blue-Background.jpeg';
import caregiverLaughingPhoto from '../assets/benefits/asset-08.png';
import aliciaCaregiverPhoto from '../assets/benefits/Alicia-and-woman-pink-shirt-sing-clean.jpeg';

export interface AudienceSituation {
  number: '01' | '02' | '03';
  heading: string;
  body: string;
}

export const AUDIENCE_SITUATIONS = [
  {
    number: '01',
    heading: 'Dementia, memory loss, or cognitive decline',
    body: 'Use familiar songs when words, attention, or conversation feel harder to reach.',
  },
  {
    number: '02',
    heading: 'Reduced engagement or withdrawal',
    body: 'Create an active alternative to passive listening, watching TV, or sitting quietly.',
  },
  {
    number: '03',
    heading: 'Care routines that need more structure',
    body: 'Give visits, afternoons, or home-care moments a familiar sing-along you can follow together.',
  },
] satisfies readonly AudienceSituation[];

export interface Benefit {
  heading: string;
  body: string;
  image: ImageMetadata;
  alt: string;
}

export const BENEFITS = [
  {
    heading: 'Singing can create a brighter moment',
    body: 'Singing familiar songs together can provide a shared activity during a routine, visit, or difficult moment.',
    image: sandyCaregiverPhoto,
    alt: 'An older woman singing expressively while a caregiver guides the SingFit experience on a tablet',
  },
  {
    heading: 'Familiar songs may encourage reminiscence and conversation',
    body: 'Singing familiar lyrics may encourage recognition, reminiscence, and conversation.',
    image: caregiverLaughingPhoto,
    alt: 'A caregiver and older loved one laughing together during a SingFit sing-along on a tablet',
  },
  {
    heading: 'SingFit gives caregivers a way to lead',
    body: 'Lyric coaching, guide vocals, and prompts make it easier to start singing together and keep the moment going.',
    image: aliciaCaregiverPhoto,
    alt: 'A caregiver using SingFit with an older loved one while guiding the next song together',
  },
] satisfies readonly Benefit[];

export interface Testimonial {
  quote: string;
  attribution: string;
}

export const TESTIMONIALS = [
  {
    quote: '“My mom has suffered with severe chronic pain for years. Her main activity is to watch TV. During our 1st SingFit session, she sang 15 songs... She\'s really enjoying this.”',
    attribution: '— Gabriella, Caregiver of her mother, who has MCI (vascular dementia) and chronic pain',
  },
  {
    quote: '“I think his mood is more stable...In fact, he will say \'I think I\'m coming back.\' He\'s feeling more like himself. And I think this is really good.”',
    attribution: '— Jan, Caregiver of her husband who has MCI',
  },
  {
    quote: '“We laughed a lot during the SingFit session - he was a different person totally. I\'m so grateful for these memories. I can’t wait to tell my kids to try this.”',
    attribution: '— Jeanne, Caregiver of her husband with dementia',
  },
  {
    quote: '“Frances looks forward to each SingFit session. She is very vocal about how much the singing helps her feel better.”',
    attribution: '— Mary Anne, Homecare Worker of her client Frances, who has dementia',
  },
] satisfies readonly Testimonial[];

export interface FaqEntry {
  question: string;
  answer: string;
}

export const FAQS = [
  {
    question: 'Do I need to be musical?',
    answer: 'No. STUDIO Caregiver is designed for everyday caregivers. The built-in lyric prompter and guided session structure help you sing along without needing to read, remember lyrics, or perform.',
  },
  {
    question: 'Who is this designed for?',
    answer: 'Family caregivers supporting an older loved one, including people experiencing dementia, cognitive decline, or related health challenges.',
  },
  {
    question: 'What happens after I schedule a walkthrough?',
    answer: 'You’ll have a complimentary 20-minute conversation with the SingFit team to ask questions, see how guided singing sessions work, and learn whether STUDIO Caregiver fits your routine.',
  },
  {
    question: 'Is support available?',
    answer: 'Yes. We can help caregivers understand the app and feel confident using guided sing-along features at home.',
  },
] satisfies readonly FaqEntry[];

export interface SectionCtaContent {
  label: string;
  note: string;
}

export const SECTION_CTAS = {
  audience: {
    label: 'See if SingFit Fits Your Routine',
    note: 'Ask questions and learn whether guided singing sessions fit your family’s routine.',
  },
  sessionVideo: {
    label: 'Get a Free App Walkthrough',
    note: 'A free product walkthrough to help you understand how guided singing sessions work.',
  },
  benefits: {
    label: 'Ask About SingFit',
    note: 'See how lyric coaching, sing-along guidance, and prompts support participation at home.',
  },
  testimonials: {
    label: 'Talk with the SingFit Team',
    note: 'Free 20-minute conversation with the SingFit team about your caregiving routine.',
  },
} satisfies Record<'audience' | 'sessionVideo' | 'benefits' | 'testimonials', SectionCtaContent>;
