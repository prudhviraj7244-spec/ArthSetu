import { GovernmentScheme, UserProfile } from '../types';

export const INDIAN_GOVERNMENT_SCHEMES: Omit<GovernmentScheme, 'matchStatus' | 'matchReason'>[] = [
  {
    id: 'pmjdy',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    hindiName: 'प्रधानमंत्री जन धन योजना',
    shortCode: 'PMJDY',
    category: 'savings',
    targetAudience: 'Unbanked citizens, students, rural & urban low-to-middle income households',
    description:
      'National Mission for Financial Inclusion ensuring access to banking facilities with zero minimum balance, RuPay debit card, ₹2 Lakh accidental insurance, and ₹10,000 overdraft facility.',
    eligibilityRules: {
      minAge: 10,
      requiresBankAccount: false,
    },
    keyBenefits: [
      'Zero minimum balance savings bank account',
      'Free RuPay debit card with inbuilt ₹2,00,000 accidental insurance',
      'Overdraft facility up to ₹10,000 after 6 months of satisfactory operation',
      'Direct Benefit Transfer (DBT) of government subsidies directly into account',
    ],
    costOrInterest: 'Free (Zero balance account, earn regular 3-4% savings interest)',
    applicationSteps: [
      'Visit any public sector or authorized commercial bank branch or Bank Mitra kiosk.',
      'Fill the simplified PMJDY account opening form.',
      'Submit Aadhaar card or acceptable officially valid document (OVD).',
      'Receive instant account kit, Passbook, and RuPay debit card.',
    ],
    documentsRequired: ['Aadhaar Card (or PAN, Voter ID, NREGA job card)', 'Passport size photograph'],
    officialPortal: 'https://pmjdy.gov.in',
  },
  {
    id: 'pmjjby',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    hindiName: 'प्रधानमंत्री जीवन ज्योति बीमा योजना',
    shortCode: 'PMJJBY',
    category: 'insurance',
    targetAudience: 'All bank account holders aged 18 to 50 years',
    description:
      'Government-backed renewable term life insurance offering ₹2,00,000 life cover in case of death of the insured due to any cause at an ultra-low premium.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 50,
      requiresBankAccount: true,
    },
    keyBenefits: [
      '₹2,00,000 sum assured paid to nominee on death of insured due to any reason',
      'One-year renewable term insurance with seamless auto-debit',
      'Tax deduction on premium under Section 80C',
    ],
    costOrInterest: '₹436 per annum (Auto-debited from bank savings account)',
    applicationSteps: [
      'Log into net banking or mobile banking app of your savings bank, or visit the branch.',
      'Search for "PMJJBY Enrollment" under Government Social Security schemes.',
      'Provide nominee details and consent for annual auto-debit on or before May 31.',
      'Certificate of insurance is instantly issued.',
    ],
    documentsRequired: ['Aadhaar Card linked to savings bank account', 'Nominee identification and KYC'],
    officialPortal: 'https://jansuraksha.gov.in',
  },
  {
    id: 'pmsby',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    hindiName: 'प्रधानमंत्री सुरक्षा बीमा योजना',
    shortCode: 'PMSBY',
    category: 'insurance',
    targetAudience: 'All bank account holders aged 18 to 70 years',
    description:
      'Most affordable accident insurance in the world: ₹2,00,000 coverage for accidental death or permanent disability for just ₹20 per year.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 70,
      requiresBankAccount: true,
    },
    keyBenefits: [
      '₹2,00,000 for accidental death or total permanent disability (loss of both eyes or limbs)',
      '₹1,00,000 for partial permanent disability (loss of one eye or one limb)',
      'Extremely low barrier to entry — affordable for every Indian citizen',
    ],
    costOrInterest: '₹20 per annum (Auto-debited in single installment)',
    applicationSteps: [
      'Access bank portal / SMS banking or submit a one-page form at any bank branch or post office.',
      'Select account for auto-debit and enter nominee details.',
      'Consent to auto-renewal each year.',
    ],
    documentsRequired: ['Active Bank Savings Account with Aadhaar seeded'],
    officialPortal: 'https://jansuraksha.gov.in',
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana (APY)',
    hindiName: 'अटल पेंशन योजना',
    shortCode: 'APY',
    category: 'pension',
    targetAudience: 'Unorganized sector workers, self-employed, small business owners, gig workers',
    description:
      'Guaranteed monthly pension of ₹1,000 to ₹5,000 from age 60, backed by the Government of India. Contribution depends on entry age.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 40,
      requiresBankAccount: true,
      specialConditions: 'Must not be an income tax payer under current IT rules.',
    },
    keyBenefits: [
      'Guaranteed fixed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000',
      'Same pension continues to spouse after subscriber’s death',
      'Accumulated pension corpus returned to nominee upon demise of both spouse and subscriber',
      'Triple tax benefits under Section 80CCD',
    ],
    costOrInterest:
      'Contribution varies: e.g. ₹42 to ₹210/month at age 18 for ₹1k to ₹5k monthly pension',
    applicationSteps: [
      'Visit your bank branch or use internet banking / APY SP portal.',
      'Provide APY registration form with Aadhaar and mobile number.',
      'Select pension slab (₹1,000 to ₹5,000) and debit frequency (monthly/quarterly/half-yearly).',
      'Receive PRAN (Permanent Retirement Account Number) card.',
    ],
    documentsRequired: ['Aadhaar Card', 'Active Bank Account', 'Mobile Number'],
    officialPortal: 'https://npscra.nsdl.co.in/scheme-details.php',
  },
  {
    id: 'ppf',
    name: 'Public Provident Fund (PPF)',
    hindiName: 'सार्वजनिक भविष्य निधि (पीपीएफ)',
    shortCode: 'PPF',
    category: 'savings',
    targetAudience: 'Salaried, self-employed, and individuals looking for sovereign guaranteed retirement savings',
    description:
      'Long-term government savings scheme with sovereign guarantee, offering attractive compound interest, complete safety, and Triple EEE (Exempt-Exempt-Exempt) tax status.',
    eligibilityRules: {
      minAge: 18,
      requiresBankAccount: false,
    },
    keyBenefits: [
      'Sovereign backed 7.1% per annum interest (compounded annually, reset quarterly)',
      'Full EEE tax benefit: Investment, interest earned, and maturity proceeds are 100% tax-free',
      'Immunity from court attachment under Debt Recovery laws',
      'Partial withdrawals permitted from the 7th financial year; loan facility from 3rd year',
    ],
    costOrInterest: 'Minimum ₹500/year to Maximum ₹1,50,000/year deposit',
    applicationSteps: [
      'Open online through Net Banking (SBI, HDFC, ICICI, PNB, etc.) or Post Office branch.',
      'Submit PPF Form A with PAN & Aadhaar.',
      'Transfer initial deposit (min ₹500). Account is activated within 24 hours.',
    ],
    documentsRequired: ['Aadhaar Card', 'PAN Card', 'Address Proof', 'Passport Photograph'],
    officialPortal: 'https://www.indiapost.gov.in',
  },
  {
    id: 'pomis',
    name: 'Post Office Monthly Income Scheme (POMIS)',
    hindiName: 'डाकघर मासिक आय योजना (एमआईएस)',
    shortCode: 'POMIS',
    category: 'savings',
    targetAudience: 'Individuals, retirees, and families wanting steady, risk-free monthly income',
    description:
      'Government of India guaranteed postal investment scheme providing fixed monthly interest payouts directly into your savings account for 5 years.',
    eligibilityRules: {
      minAge: 18,
      requiresBankAccount: false,
    },
    keyBenefits: [
      'Guaranteed 7.4% per annum interest paid out on monthly basis',
      'Deposit limits: up to ₹9,00,000 (single account) and ₹15,00,000 (joint account)',
      '100% sovereign capital safety with Indian Department of Posts',
      'Automatic monthly payout transfer to Post Office Savings Account or bank account',
    ],
    costOrInterest: 'Lump-sum deposit (multiples of ₹1,000 up to ₹9 Lakh / ₹15 Lakh)',
    applicationSteps: [
      'Visit nearest India Post branch.',
      'Fill POMIS application form (Joint or Single).',
      'Submit deposit via cheque or cash along with KYC documents.',
      'Nominate beneficiary and receive MIS passbook.',
    ],
    documentsRequired: ['Aadhaar Card', 'PAN Card', 'Proof of residence', 'Post Office savings passbook'],
    officialPortal: 'https://www.indiapost.gov.in',
  },
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    hindiName: 'प्रधानमंत्री मुद्रा योजना',
    shortCode: 'PMMY',
    category: 'loan',
    targetAudience: 'Small business owners, kirana shopkeepers, artisans, self-employed entrepreneurs',
    description:
      'Collateral-free micro loans up to ₹20 Lakh (upgraded in Budget 2024-25) to non-corporate, non-farm small/micro enterprises across Shishu, Kishore, and Tarun categories.',
    eligibilityRules: {
      minAge: 18,
      maxAge: 65,
      allowedOccupations: ['business_owner', 'self_employed', 'daily_wage'],
    },
    keyBenefits: [
      'No collateral or third-party guarantee required',
      'Three categories: Shishu (up to ₹50k), Kishore (₹50k to ₹5L), Tarun (₹5L to ₹20L)',
      'Mudra Card (RuPay Debit) provided for flexible working capital withdrawal',
      'Extremely subsidized interest rates linked to RBI repo rate',
    ],
    costOrInterest: 'Interest rates typically 8.5% to 11.5% p.a. (Bank specific)',
    applicationSteps: [
      'Apply online on Udyamimitra portal (udyamimitra.in) or visit any commercial/RRB bank branch.',
      'Submit Business Plan, quotation of machinery/inventory to be purchased.',
      'Complete credit appraisal with loan officer.',
      'Loan sanctioned and disbursed directly to supplier or business account.',
    ],
    documentsRequired: ['Business Proof / Udyam Registration', 'Aadhaar & PAN', 'Past 6 months bank statement', 'Quotation for machinery/stocks'],
    officialPortal: 'https://www.mudra.org.in',
  },
  {
    id: 'nsp-scholarships',
    name: 'National Scholarship Portal (NSP) & Central Sector Schemes',
    hindiName: 'राष्ट्रीय छात्रवृत्ति पोर्टल (विद्यार्थी सहायता)',
    shortCode: 'NSP',
    category: 'scholarship',
    targetAudience: 'Students enrolled in school, college, undergraduate, or vocational studies',
    description:
      'Direct government educational grant providing tuition fee reimbursement, maintenance allowances, and merit scholarships for higher education without loan burden.',
    eligibilityRules: {
      minAge: 14,
      maxAge: 28,
      allowedOccupations: ['student'],
      maxAnnualIncome: 800000,
    },
    keyBenefits: [
      'Financial aid ranging from ₹10,000 to ₹50,000 per academic year directly into student DBT account',
      'Merit-cum-means assistance for college degree, engineering, medical, and vocational programs',
      'Special reservations and support for Tier-2/Tier-3 aspirational district youth',
    ],
    costOrInterest: '100% Free Grant / Scholarship (No repayment required)',
    applicationSteps: [
      'Register on scholarships.gov.in using Aadhaar/Aadhaar Enrollment ID.',
      'Upload institute Bonafide certificate and latest marksheet.',
      'Institute verifies application online via NSP nodal officer.',
      'Scholarship disbursed directly to student bank account via PFMS.',
    ],
    documentsRequired: ['Student Bank Passbook', 'Income Certificate', 'Academic Marksheet', 'Bonafide Certificate', 'Aadhaar Card'],
    officialPortal: 'https://scholarships.gov.in',
  },
  {
    id: 'sukanya-samriddhi',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    hindiName: 'सुकन्या समृद्धि योजना (बेटी बचाओ बेटी पढ़ाओ)',
    shortCode: 'SSY',
    category: 'savings',
    targetAudience: 'Parents/guardians of girl children aged up to 10 years',
    description:
      'Highest-interest sovereign savings scheme created to secure the higher education and marriage expenses of girl children with full EEE tax exemption.',
    eligibilityRules: {
      minAge: 18, // parent's age
      specialConditions: 'For family with girl child under 10 years of age',
    },
    keyBenefits: [
      'High government interest rate of 8.2% per annum (compounded annually)',
      'Triple tax exemption (EEE) under Section 80C',
      'Partial withdrawal allowed after girl attains 18 years for higher education',
      'Account matures 21 years from opening date or on marriage after age 18',
    ],
    costOrInterest: 'Min ₹250 to Max ₹1,50,000 per financial year',
    applicationSteps: [
      'Visit Post Office or authorized bank branch (SBI, PNB, BOB, etc.).',
      'Fill SSY Form with birth certificate of the girl child.',
      'Deposit minimum ₹250.',
      'Collect SSY Passbook.',
    ],
    documentsRequired: ['Birth certificate of girl child', 'Parent/Guardian KYC (Aadhaar & PAN)', 'Address proof'],
    officialPortal: 'https://www.indiapost.gov.in',
  },
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM Jan Arogya Yojana (AB-PMJAY)',
    hindiName: 'आयुष्मान भारत (मुफ्त ₹5 लाख स्वास्थ्य सुरक्षा)',
    shortCode: 'PM-JAY',
    category: 'insurance',
    targetAudience: 'Economically vulnerable families, informal workers, small artisans across all tiers',
    description:
      'The world’s largest health assurance scheme providing a health cover of ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
    eligibilityRules: {
      maxAnnualIncome: 350000,
      requiresBankAccount: false,
    },
    keyBenefits: [
      'Cashless and paperless access to healthcare services in empaneled public and private hospitals across India',
      '₹5,00,000 per family per year cover with no cap on family size or age',
      'Covers pre-existing conditions from Day 1 and 3 days pre-hospitalization & 15 days post-hospitalization expenses',
    ],
    costOrInterest: '100% Free (Funded by Central & State Governments)',
    applicationSteps: [
      'Check eligibility on mera.pmjay.gov.in or call toll-free 14555.',
      'Visit any Empaneled Health Care Provider (EHCP) or Common Service Center (CSC).',
      'Verify identity with Aadhaar or Ration Card at the Pradhan Mantri Arogya Mitra kiosk.',
      'Receive Ayushman Golden Card for cashless treatment.',
    ],
    documentsRequired: ['Aadhaar Card', 'Ration Card / SECC proof', 'Family register document'],
    officialPortal: 'https://pmjay.gov.in',
  },
];

/**
 * Dynamic Scheme Matcher: evaluates user profile against all Indian schemes
 */
export function evaluateUserSchemes(profile: UserProfile): GovernmentScheme[] {
  const annualIncome = profile.monthlyIncome * 12;

  return INDIAN_GOVERNMENT_SCHEMES.map((scheme) => {
    let matchStatus: GovernmentScheme['matchStatus'] = 'eligible';
    const reasons: string[] = [];

    // Check age
    if (scheme.eligibilityRules.minAge !== undefined && profile.age < scheme.eligibilityRules.minAge) {
      matchStatus = 'not_eligible';
      reasons.push(`Minimum age required is ${scheme.eligibilityRules.minAge} (You are ${profile.age}).`);
    }
    if (scheme.eligibilityRules.maxAge !== undefined && profile.age > scheme.eligibilityRules.maxAge) {
      matchStatus = 'not_eligible';
      reasons.push(`Maximum age limit is ${scheme.eligibilityRules.maxAge} (You are ${profile.age}).`);
    }

    // Check occupation
    if (
      scheme.eligibilityRules.allowedOccupations &&
      scheme.eligibilityRules.allowedOccupations.length > 0 &&
      !scheme.eligibilityRules.allowedOccupations.includes(profile.occupation)
    ) {
      matchStatus = 'not_eligible';
      reasons.push(
        `Targeted at ${scheme.eligibilityRules.allowedOccupations.map((o) => o.replace('_', ' ')).join(', ')}.`
      );
    }

    // Check income limit
    if (
      scheme.eligibilityRules.maxAnnualIncome !== undefined &&
      annualIncome > scheme.eligibilityRules.maxAnnualIncome
    ) {
      if (annualIncome < scheme.eligibilityRules.maxAnnualIncome * 1.25) {
        if (matchStatus !== 'not_eligible') matchStatus = 'likely_eligible';
        reasons.push(
          `Annual income (₹${(annualIncome / 100000).toFixed(1)}L) is close to threshold ₹${(scheme.eligibilityRules.maxAnnualIncome / 100000).toFixed(1)}L.`
        );
      } else {
        matchStatus = 'not_eligible';
        reasons.push(
          `Annual income exceeds the ceiling of ₹${(scheme.eligibilityRules.maxAnnualIncome / 100000).toFixed(1)} Lakh.`
        );
      }
    }

    // Special checks
    if (scheme.id === 'pm-mudra') {
      if (profile.occupation === 'business_owner' || profile.occupation === 'self_employed') {
        matchStatus = 'eligible';
        reasons.push(`Highly recommended for your ${profile.occupation.replace('_', ' ')} working capital needs.`);
      }
    }

    if (scheme.id === 'nsp-scholarships') {
      if (profile.occupation === 'student') {
        matchStatus = 'eligible';
        reasons.push(`Direct educational grant match for students in ${profile.city}.`);
      }
    }

    if (scheme.id === 'apy') {
      if (annualIncome > 600000) {
        matchStatus = 'not_eligible';
        reasons.push('Income tax payers are no longer eligible for new APY enrollments.');
      } else if (profile.age >= 18 && profile.age <= 40) {
        matchStatus = 'eligible';
        reasons.push(`Ideal pension tool for age ${profile.age} with guaranteed returns.`);
      }
    }

    if (scheme.id === 'pmjjby' || scheme.id === 'pmsby') {
      if (profile.age >= 18 && profile.age <= 50) {
        matchStatus = 'eligible';
        reasons.push('Essential low-cost financial safety net for your family.');
      }
    }

    let matchReason = '';
    if (matchStatus === 'eligible') {
      matchReason = reasons.length > 0 ? reasons.join(' ') : 'You meet all key eligibility criteria.';
    } else if (matchStatus === 'likely_eligible') {
      matchReason = reasons.join(' ');
    } else {
      matchReason = reasons.join(' ');
    }

    return {
      ...scheme,
      matchStatus,
      matchReason,
    };
  });
}
