export interface FAQItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "How much can I save on electricity bills by installing solar in Sydney?",
    answer:
      "Most Sydney households save between $1,200 and $2,800 annually on electricity bills with a properly sized 6.6kW to 10kW solar system. With daytime solar powering air conditioning and household appliances, grid reliance drops by 50% to 75%. Adding a solar battery allows households to store excess generation and use clean energy during peak evening hours, pushing annual savings even higher.",
  },
  {
    question: "What solar and battery rebates are available in NSW in 2025/2026?",
    answer:
      "Sydney and NSW homeowners can access two major incentives: (1) The Federal Government Small-scale Renewable Energy Scheme (SRES), providing Small-scale Technology Certificates (STCs) that take an immediate point-of-sale discount of approximately $2,000 to $3,500 off system installation costs, and (2) The NSW Peak Demand Reduction Scheme (PDRS) battery rebate, offering up to $1,600 to $2,400 off eligible home battery installations. As a Clean Energy Council (CEC) accredited installer, Hujurat Solar applies all rebates directly at the point of sale.",
  },
  {
    question: "What size solar system do I need for my home in Sydney or Western Sydney?",
    answer:
      "System sizing is determined by your daily kilowatt-hour (kWh) usage on your electricity bill. A 6.6kW system (15–16 panels) is the entry-level standard for 2–3 bedroom homes using 15–20 kWh/day. For larger 4–5 bedroom homes with ducted air conditioning, swimming pools, or plans for an electric vehicle (EV), a 10kW to 13.3kW solar system paired with a 10kWh–15kWh battery provides optimal energy independence and future-proofing.",
  },
  {
    question: "Why is my solar inverter showing a red light or fault error, and how is it fixed?",
    answer:
      "A red warning light on your solar inverter (such as GoodWe, Sungrow, Fronius, or SMA) indicates an operational fault—commonly an isolation fault (PV isolation error), grid over-voltage disconnect, DC isolator water ingress, or internal hardware error. If restarting your system via the AC/DC shutdown procedure does not clear the light, do not attempt to open electrical enclosures yourself. Hujurat Solar provides expert solar fault diagnosis and repairs across Greater Sydney to safely restore your system.",
  },
  {
    question: "Why is choosing a Clean Energy Council (CEC) accredited installer crucial?",
    answer:
      "CEC accreditation ensures that your solar and battery installation complies with strict Australian Standards (AS/NZS 5033 and AS/NZS 4777). Crucially, the Clean Energy Regulator only grants Federal STC solar rebates and NSW state rebates when the installation is signed off by a CEC-accredited installer using CEC-approved panels and inverters. Hujurat Solar is fully accredited, ensuring top-tier safety, compliance, and guaranteed rebate eligibility.",
  },
  {
    question: "Can a solar battery provide backup power during a blackout?",
    answer:
      "Yes, when configured with Emergency Power Supply (EPS) or blackout backup circuitry. Systems like the Sungrow SBR, Tesla Powerwall, and BYD Battery-Box automatically isolate your home from the grid within milliseconds of an outage (anti-islanding protection) and keep essential circuits—such as your refrigerator, lighting, WiFi router, and medical equipment—powered seamlessly.",
  },
  {
    question: "How does the grid connection process work with Ausgrid and Endeavour Energy?",
    answer:
      "Before turning on your solar system, connection approval must be obtained from your local Distribution Network Service Provider (Ausgrid in Sydney's CBD/East/North, or Endeavour Energy in Western Sydney). Hujurat Solar handles 100% of the paperwork, network connection applications, and bi-directional smart meter upgrade requests on your behalf, so you don't have to lift a finger.",
  },
  {
    question: "What warranties do Hujurat Solar systems come with?",
    answer:
      "All our installations feature Tier-1 CEC-approved equipment backed by extensive warranties: 25 to 30-year performance warranties on solar panels, 10 to 12-year manufacturer warranties on hybrid inverters, 10-year warranties on battery storage units, and our own comprehensive 5-year workmanship guarantee on all electrical and mounting labour.",
  },
];
