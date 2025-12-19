import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I generate and download a PDF?",
    answer: "Select your preferred paper type from the dropdown menu, customize the settings to your liking, then click the 'Download PDF' button. The PDF will be generated instantly and downloaded to your device."
  },
  {
    question: "What paper types are available?",
    answer: "We offer 9 different paper types: Dot Grid (perfect for bullet journaling), Isometric Dots (for 3D sketching), Graph Paper (for math and technical work), Lined Paper (for writing), Music Staff (for composing), Checklist (for task lists), Hexagon Grid (for D&D and tabletop games), Knitting/Cross-Stitch (for craft patterns), and Calligraphy (for lettering practice)."
  },
  {
    question: "What paper sizes can I choose from?",
    answer: "Standard sizes include A4, US Letter, and Legal. For larger projects, we offer poster sizes: A2, A1, A0, and architectural sizes Arch C (18x24 inches), Arch D (24x36 inches), and Arch E (36x48 inches)."
  },
  {
    question: "How do I use the Batch Export feature?",
    answer: "Click the 'Batch Export' button in the sidebar. Check the boxes next to the paper types you want to include, then click 'Download Batch PDF'. All selected paper types will be combined into a single PDF file with each type on its own page."
  },
  {
    question: "What does the Ink Saver option do?",
    answer: "Ink Saver changes the pattern color to a light grey instead of black. This uses significantly less printer ink while still providing visible guidelines. Click the button once to activate (it will show 'Ink Saver On'), and click again to return to black."
  },
  {
    question: "How do I customize the pattern color?",
    answer: "Enable the 'Custom Color' toggle in the Color section of the sidebar. A color picker will appear where you can select any color you like. This overrides the default color options."
  },
  {
    question: "How do I change the background color?",
    answer: "Enable the 'Custom Background' toggle in the Color section. You can then pick any background color for your paper. This is useful for creating colored paper effects like engineering paper (yellow background with green grid)."
  },
  {
    question: "What are the edge rulers for?",
    answer: "Toggle 'Show Rulers' to add measurement rulers along the edges of your paper. Use the mm/inches toggle to switch between metric and imperial measurements. These rulers help with accurate measurements when using your printed paper."
  },
  {
    question: "How do I print the PDF correctly?",
    answer: "When printing, make sure to: 1) Set 'Page Scaling' or 'Scale' to 100% or 'Actual Size' (not 'Fit to Page'). 2) Disable any 'Shrink to Fit' options. 3) Set margins to 'None' or 'Minimum'. This ensures the grid pattern prints at the exact specified measurements."
  },
  {
    question: "What settings should I use for Dot Grid bullet journaling?",
    answer: "For standard bullet journaling, try 5mm spacing with a dot size of 1-2 and opacity around 50%. This provides a subtle grid that's visible enough for guidance but doesn't distract from your writing and drawings."
  },
  {
    question: "How do I set up Hexagon Grid for D&D battle maps?",
    answer: "Select 'Hexagon Grid' paper type. The default 1 inch hex size is standard for miniature gaming. For larger maps, try Arch D or Arch E paper sizes. You can adjust hex size using the presets (1 inch, 3/4 inch, 1/2 inch) or enter a custom size."
  },
  {
    question: "What's the difference between regular Graph Paper and Isometric Dots?",
    answer: "Graph Paper has a square grid ideal for 2D drawings, charts, and math work. Isometric Dots are arranged in a hexagonal pattern at 60-degree angles, perfect for drawing 3D objects with proper perspective (isometric projection)."
  },
  {
    question: "How do I use the Knitting/Cross-Stitch paper?",
    answer: "This paper type creates a rectangular grid matching knitting gauge ratios. Adjust the stitch width and height to match your actual gauge (stitches and rows per inch/cm). The default 5mm x 7.5mm ratio is common for many yarn weights."
  },
  {
    question: "What are the Calligraphy paper settings?",
    answer: "Calligraphy paper includes horizontal lines for consistent letter height plus angled guide lines for uniform slant. Adjust the slant angle (typically 52-55 degrees for italic styles) and line height to match your pen nib size."
  },
  {
    question: "Can I save my settings?",
    answer: "Yes! Your settings are automatically saved in your browser. When you return to the site, your previous settings will be restored. Note that settings are stored locally and won't transfer between different browsers or devices."
  },
  {
    question: "The preview looks small for large paper sizes. How can I see the pattern?",
    answer: "For large format sizes (A0, A1, Arch E, etc.), the preview shows a portion of the paper that you can scroll through. The paper size label above the preview confirms what size will be generated. The actual PDF will contain the complete pattern at full resolution."
  },
  {
    question: "Is the generated PDF vector-based?",
    answer: "Yes! All PDFs are generated using vector graphics (lines and circles, not pixels). This means they'll print crisp and clear at any resolution, and the file sizes stay small even for large format paper."
  },
  {
    question: "Why do the measurements matter for printing?",
    answer: "All patterns are generated at exact real-world measurements. A 5mm grid will print exactly 5mm when printed at 100% scale. This is essential for applications like graph paper for math, hex grids for gaming miniatures, and knitting patterns that need to match your gauge."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-sidebar p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions about using FreeGridPaper to create custom printable paper.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg p-6"
              data-testid={`faq-item-${index}`}
            >
              <h2 className="text-xl font-semibold text-foreground mb-3">
                {faq.question}
              </h2>
              <p className="text-base leading-relaxed text-foreground/90">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? Check out our other pages:
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/pages/about.html" className="text-primary hover:underline" data-testid="link-about">
              About Us
            </a>
            <a href="/pages/contact.html" className="text-primary hover:underline" data-testid="link-contact">
              Contact
            </a>
            <a href="/pages/privacy.html" className="text-primary hover:underline" data-testid="link-privacy">
              Privacy Policy
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
