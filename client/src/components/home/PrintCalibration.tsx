import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { jsPDF } from 'jspdf';
import { trackEvent } from '@/lib/analytics';

export const PrintCalibration: React.FC = () => {
  const [open, setOpen] = useState(false);

  const downloadCalibrationPDF = () => {
    trackEvent('download_calibration_pdf');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    doc.setFontSize(16);
    doc.text('Print Calibration Sheet', 105, 30, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text('1. Print this page at exactly 100% scale (Do NOT use "Fit to Page").', 20, 50);
    doc.text('2. Measure the squares below with a physical ruler.', 20, 60);
    doc.text('3. If the squares match your ruler, your printer is correctly calibrated.', 20, 70);

    // 1 inch square
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(40, 90, 25.4, 25.4); // 1 inch = 25.4mm
    doc.text('1 inch', 40 + 12.7, 90 + 12.7 + 2, { align: 'center' });

    // 50mm square (better for measuring than 10mm)
    doc.rect(100, 90, 50, 50);
    doc.text('50 mm', 125, 115 + 2, { align: 'center' });

    doc.save('freegridpaper-calibration.pdf');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-primary hover:underline text-center text-sm">
          Print Calibration
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Print Calibration Helper</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4 text-slate-700">
          <p>
            When printing grid paper, it is crucial that your printer does not distort the scale. Many printers default to "Fit to Page", which will make 5mm dots slightly smaller or larger than 5mm.
          </p>
          <div className="bg-slate-50 p-4 rounded-md border text-sm">
            <h4 className="font-semibold mb-2">How to test your printer:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Download the calibration PDF below.</li>
              <li>Open the PDF and select Print.</li>
              <li>In your printer dialog, find the Scale or Size setting.</li>
              <li>Set it to <strong>"Actual Size"</strong> or <strong>"100% Scale"</strong>.</li>
              <li>Print the page and measure the printed squares with a real ruler.</li>
            </ol>
          </div>
          <Button onClick={downloadCalibrationPDF} className="w-full mt-2">
            <Ruler className="w-4 h-4 mr-2" />
            Download Calibration PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
