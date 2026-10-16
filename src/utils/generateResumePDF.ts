import { jsPDF } from 'jspdf';
import { PROFILE_DATA } from '../data/profile';

export function generateResumePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const secondaryColor: [number, number, number] = [13, 148, 136]; // Teal 600
  const textColor: [number, number, number] = [30, 41, 59]; // Slate 800
  const mutedColor: [number, number, number] = [100, 116, 139]; // Slate 500

  // Helper for section title
  const addSectionHeader = (title: string) => {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.5;
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 3.5;
  };

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...primaryColor);
  doc.text(PROFILE_DATA.name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedColor);
  const contactText = `${PROFILE_DATA.location}  |  ${PROFILE_DATA.email}  |  ${PROFILE_DATA.phone}  |  linkedin.com/in/arshdeep-kaur-9ba3a1357`;
  doc.text(contactText, pageWidth / 2, y, { align: 'center' });
  y += 4;

  // Links line
  const portfolioText = `GitHub: github.com/arshdeepk1209-web  |  Tableau: public.tableau.com/app/profile/arshdeep.kaur7968`;
  doc.text(portfolioText, pageWidth / 2, y, { align: 'center' });
  y += 3;

  // 1. PROFILE SUMMARY
  addSectionHeader('Profile Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textColor);
  const summaryLines = doc.splitTextToSize(PROFILE_DATA.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 3.4 + 1.5;

  // 2. RELEVANT EXPERIENCE & FITMENT TO ROLE
  addSectionHeader('Relevant Experience & Fitment to Role');

  PROFILE_DATA.experiences.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(...primaryColor);
    doc.text(`${exp.role} — ${exp.company}`, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(exp.period, margin + contentWidth, y, { align: 'right' });
    y += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textColor);

    exp.highlights.forEach((point) => {
      const bulletText = `•  ${point}`;
      const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 3);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 3.3;
    });

    if (exp.link) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...secondaryColor);
      doc.text(`•  Tableau Profile: ${exp.link.url}`, margin + 2, y);
      y += 3.5;
    }
    y += 1.5;
  });

  // 3. KEY PROJECTS (GITHUB)
  addSectionHeader('Key Projects (GitHub)');

  PROFILE_DATA.projects.forEach((proj) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(...primaryColor);
    doc.text(proj.title, margin, y);

    if (proj.githubUrl) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...secondaryColor);
      doc.text(`GitHub: ${proj.githubUrl}`, margin + contentWidth, y, { align: 'right' });
    }
    y += 3.6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textColor);

    proj.bullets.forEach((bullet) => {
      const bulletText = `•  ${bullet}`;
      const splitBullet = doc.splitTextToSize(bulletText, contentWidth - 3);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 3.3;
    });
    y += 1.5;
  });

  // 4. SKILLS ALIGNED TO ROLE REQUIREMENTS
  addSectionHeader('Skills Aligned to Role Requirements');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textColor);

  const skillsList = [
    '•  Machine Learning & Computer Vision: BLIP-2, YOLOv8, OpenCV, EasyOCR, Intel OpenVINO, Scikit-Learn',
    '•  Data Analytics & Technical: Python (Pandas, NumPy, Matplotlib), SQL, MongoDB, FastAPI, REST APIs, Tableau Desktop',
    '•  AI Evaluation & Methodologies: Model response evaluation, comparative scoring, structured justification, benchmarking',
    '•  Soft Skills: Communication (technical & non-technical), team management & collaboration, problem solving, adaptability'
  ];

  skillsList.forEach((skill) => {
    const splitSkill = doc.splitTextToSize(skill, contentWidth - 2);
    doc.text(splitSkill, margin + 1, y);
    y += splitSkill.length * 3.4;
  });
  y += 1.5;

  // 5. EDUCATION
  addSectionHeader('Education');
  PROFILE_DATA.education.forEach((edu) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.3);
    doc.setTextColor(...primaryColor);
    doc.text(edu.degree, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(`${edu.institution} | ${edu.period}`, margin + contentWidth, y, { align: 'right' });
    y += 3.8;
  });
  y += 1;

  // 6. CERTIFICATIONS
  addSectionHeader('Certifications');
  PROFILE_DATA.certifications.forEach((cert) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textColor);
    const certText = `•  ${cert.name} — ${cert.issuer} (${cert.year})`;
    const splitCert = doc.splitTextToSize(certText, contentWidth - 2);
    doc.text(splitCert, margin + 1, y);
    y += splitCert.length * 3.3;
  });

  // Footer stamp
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(...mutedColor);
  doc.text('Generated from Arshdeep Kaur Portfolio — AI & ML Graduate — arshdeepk1209@gmail.com', pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save the PDF directly to user's device
  doc.save('Arshdeep_Kaur_Resume.pdf');
}
