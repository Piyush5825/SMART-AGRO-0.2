
import { DiseaseInfo } from '../types';

export const OFFLINE_DISEASES: DiseaseInfo[] = [
  {
    id: 'd1',
    cropName: 'कापूस',
    affectedCrops: ['कापूस', 'भेंडी'],
    diseaseName: 'लाल पडणे (Reddening)',
    reason: 'मॅग्नेशियमची कमतरता आणि थंडी.',
    solution: 'मॅग्नेशियम सल्फेटची फवारणी.',
    pesticides: 'नाही.',
    herbicides: 'नाही.',
    compost: 'सेंद्रिय मॅग्नेशियमयुक्त खत.',
    precautions: 'वेळेवर खत व्यवस्थापन करा.',
    imageUrl: 'https://images.unsplash.com/photo-1594900574131-9a744439c7fb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd2',
    cropName: 'कांदा',
    affectedCrops: ['कांदा', 'लसूण'],
    diseaseName: 'जांभळा करपा (Purple Blotch)',
    reason: 'बुरशीजन्य संसर्ग.',
    solution: 'बुरशीनाशकाचा वापर.',
    pesticides: 'मॅन्कोझेब किंवा कार्बेंडाझिम.',
    herbicides: 'नाही.',
    compost: 'निंबोळी पेंड.',
    precautions: 'पाण्याचा निचरा व्यवस्थित ठेवा.',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd3',
    cropName: 'सोयाबीन',
    affectedCrops: ['सोयाबीन', 'मूग', 'उडीद'],
    diseaseName: 'पिवळा मोझॅक (Yellow Mosaic)',
    reason: 'पांढरी माशी (White Fly).',
    solution: 'मावा-तुडतुडे नियंत्रण.',
    pesticides: 'इमिडाक्लोप्रिड.',
    herbicides: 'नाही.',
    compost: 'दशपर्णी अर्क.',
    precautions: 'प्रादुर्भाव दिसताच झाडे उपटून टाका.',
    imageUrl: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd4',
    cropName: 'मका',
    affectedCrops: ['मका', 'ज्वारी'],
    diseaseName: 'लष्करी अळी (Fall Armyworm)',
    reason: 'स्पोडोप्टेरा अळीचा हल्ला.',
    solution: 'मक्याच्या पोंग्यात औषध टाकणे.',
    pesticides: 'एमामेक्टिन बेंझोएट.',
    herbicides: 'नाही.',
    compost: 'शेणखत.',
    precautions: 'सेंद्रिय कीटकनाशकांचा वापर करा.',
    imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd5',
    cropName: 'द्राक्षे',
    affectedCrops: ['द्राक्षे'],
    diseaseName: 'केवडा (Downy Mildew)',
    reason: 'जास्त आर्द्रता आणि पाऊस.',
    solution: 'कॉपरयुक्त बुरशीनाशक.',
    pesticides: 'मेटॅलॅक्सिल.',
    herbicides: 'नाही.',
    compost: 'वर्मीकम्पोस्ट.',
    precautions: 'वेळेवर छाटणी आणि हवा खेळती ठेवा.',
    imageUrl: 'https://images.unsplash.com/photo-1537084642907-629340c7e59c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd6',
    cropName: 'मिरची',
    affectedCrops: ['मिरची', 'टोमॅटो', 'वांगी'],
    diseaseName: 'चुरडा-मुरडा (Leaf Curl)',
    reason: 'थ्रिप्स आणि कोळी कीटकांमुळे.',
    solution: 'पिवळ्या चिकट सापळ्यांचा वापर.',
    pesticides: 'फिप्रोनिल किंवा स्पिनोसॅड.',
    herbicides: 'नाही.',
    compost: 'गोमूत्र आणि हिंग फवारणी.',
    precautions: 'रोपांची अवस्था असतानाच काळजी घ्या.',
    imageUrl: 'https://images.unsplash.com/photo-1597362860722-39402c617022?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd7',
    cropName: 'गहू',
    affectedCrops: ['गहू', 'बाजरी'],
    diseaseName: 'तांबेरा (Rust)',
    reason: 'हवेतील ओलावा आणि थंड हवामान.',
    solution: 'सल्फरयुक्त बुरशीनाशकाची फवारणी.',
    pesticides: 'प्रोपीकोनॅझोल.',
    herbicides: '२,४-डी (तणनाशक).',
    compost: 'सेंद्रिय खत.',
    precautions: 'रोगप्रतिकारक जातींचा वापर करा.',
    imageUrl: 'https://images.unsplash.com/photo-1501431821163-9dcd9e922974?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'd8',
    cropName: 'डाळिंब',
    affectedCrops: ['डाळिंब'],
    diseaseName: 'तेल्या (Bacterial Blight)',
    reason: 'बॅक्टेरिया (Xanthomonas).',
    solution: 'प्रतिजैविके आणि बोर्डो मिश्रण.',
    pesticides: 'स्ट्रेप्टोसायक्लीन.',
    herbicides: 'नाही.',
    compost: 'ट्रायकोडर्मा विरिडी.',
    precautions: 'पाऊस पडण्यापूर्वी बोर्डो मिश्रण फवारा.',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=400'
  },
  // Adding more entries to simulate a larger library
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `ext-${i}`,
    cropName: i % 2 === 0 ? 'भाजीपाला' : 'फळबाग',
    affectedCrops: ['विविध पिके'],
    diseaseName: `बुरशीजन्य करपा प्रकार ${i + 1}`,
    reason: 'बुरशी आणि खराब निचरा.',
    solution: 'कार्बेंडाझिम फवारणी.',
    pesticides: 'बुरशीनाशक.',
    herbicides: 'नाही.',
    compost: 'सेंद्रिय खत.',
    precautions: 'वेळेवर पाणी नियोजन.',
    imageUrl: `https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400&sig=${i}`
  }))
];
