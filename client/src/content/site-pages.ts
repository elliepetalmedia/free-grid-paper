import type { SitePageEntry } from './types';
import { templates } from './templates';

const previewImage = '/previews/freegridpaper-preview.svg';
const socialImage = '/og/freegridpaper-og.svg';
const updatedAt = '2026-05-22';

export const sitePages: SitePageEntry[] = [
  {
    kind: 'site',
    id: 'home',
    slug: '',
    path: '/',
    canonicalPath: '/templates',
    indexable: false,
    title: 'FreeGridPaper - Free Printable Grid Paper Generator',
    description: 'Generate custom printable grid paper, dot grids, lined paper, music staves, and specialty stationery instantly as vector PDFs.',
    h1: 'FreeGridPaper',
    summary: 'Create print-ready stationery PDFs directly in your browser.',
    answerSummary: 'FreeGridPaper is a printable-paper generator and reference library for graph paper, dot grid, ruled paper, music paper, hex maps, storyboards, and other specialty layouts.',
    updatedAt,
    previewImage,
    socialImage,
    body: [
      {
        heading: 'Print-ready paper',
        body: 'FreeGridPaper creates crisp vector PDFs for graph paper, dot grids, writing paper, music paper, and specialty layouts.',
      },
    ],
  },
  {
    kind: 'site',
    id: 'templates',
    slug: 'templates',
    path: '/templates',
    canonicalPath: '/templates',
    indexable: true,
    title: 'Printable Paper Templates | FreeGridPaper',
    description: 'Browse every FreeGridPaper template, including graph paper, dot grids, hex grids, lined paper, music paper, and drawing guides.',
    h1: 'Printable Paper Templates',
    summary: 'Browse every printable paper generator by category.',
    answerSummary: 'FreeGridPaper organizes printable paper by use case so users can reach a canonical template or preset page quickly instead of relying on query-string generator states.',
    updatedAt,
    previewImage,
    socialImage,
    bestFor: ['Finding the right printable paper type quickly', 'Starting from a known preset', 'Exploring related guides and comparison pages'],
    referenceFacts: [
      { label: 'Current template count', value: `${templates.length}` },
      { label: 'Output format', value: 'Vector PDF' },
      { label: 'Printing rule', value: 'Print at Actual Size or 100%' },
    ],
    body: [
      {
        heading: 'How to use the library',
        body: 'Start with a category if you know the job to be done, such as bullet journaling, engineering homework, music notation, tabletop mapping, or handwriting practice. Then choose a template or preset page that matches the physical paper and spacing you need.',
      },
      {
        heading: 'Why canonical pages matter',
        body: 'The generator supports many settings combinations, but the best citeable destinations are the canonical template, preset, and guide pages. Those routes describe the intent, measurements, and print guidance in stable URLs that search systems can index.',
      },
    ],
    relatedQuestions: [
      { question: 'Which graph paper size should I start with?', answer: '5 mm and 1/4 inch graph paper are the most useful starting points for general graphing and technical work.', href: '/guides/graph-paper-sizes-explained' },
      { question: 'What dot grid spacing is best for bullet journals?', answer: '5 mm is the most common bullet-journal spacing because it balances structure and writing room.', href: '/guides/best-dot-grid-spacing-for-bullet-journaling' },
      { question: 'How do I print the paper at the right size?', answer: 'Export the PDF, then print at Actual Size or 100% scale so the physical spacing stays accurate.', href: '/guides/how-to-print-at-actual-size' },
    ],
  },
  {
    kind: 'site',
    id: 'faq',
    slug: 'faq',
    path: '/faq',
    canonicalPath: '/faq',
    indexable: true,
    title: 'Frequently Asked Questions | FreeGridPaper',
    description: 'Answers to common questions about creating, customizing, downloading, and printing FreeGridPaper PDFs.',
    h1: 'Frequently Asked Questions',
    summary: 'Help for generating and printing paper templates correctly.',
    answerSummary: 'Most printable-paper problems come down to choosing the right spacing and printing the PDF at Actual Size. The FAQ covers those basics plus common use cases for presets and specialty templates.',
    updatedAt,
    previewImage,
    socialImage,
    faqs: [
      {
        question: 'How do I generate and download a PDF?',
        answer: 'Use a quick download preset or customize your paper type, size, and settings, then click Download PDF. The PDF is generated instantly in your browser.',
      },
      {
        question: 'What paper types are available?',
        answer: `FreeGridPaper includes ${templates.length} current printable templates, including graph paper, dot grids, isometric dots, hex grids, lined paper, handwriting guides, music staff paper, guitar tab, bass tab, checklist paper, calligraphy guides, genkoyoushi, perspective grids, comic layouts, storyboards, engineering paper, and large-format poster options.`,
      },
      {
        question: 'How do I print the PDF correctly?',
        answer: 'Set Page Scaling or Scale to 100% or Actual Size, disable Shrink to Fit, and use minimum margins when exact grid measurements matter.',
      },
    ],
    body: [],
  },
  {
    kind: 'site',
    id: 'about',
    slug: 'about',
    path: '/about',
    canonicalPath: '/about',
    indexable: true,
    title: 'About FreeGridPaper',
    description: 'Learn about FreeGridPaper, a browser-based tool for printable vector PDF stationery.',
    h1: 'About FreeGridPaper',
    summary: 'FreeGridPaper is built for fast, private, print-ready stationery generation.',
    answerSummary: 'FreeGridPaper publishes printable-paper templates and factual reference pages designed to help users choose the right paper format, export a clean PDF, and print it at accurate physical dimensions.',
    updatedAt,
    previewImage,
    socialImage,
    referenceFacts: [
      { label: 'Publisher', value: 'Ellie Petal Media' },
      { label: 'Primary output', value: 'Vector PDF' },
      { label: 'Site purpose', value: 'Printable paper generation and reference' },
    ],
    body: [
      {
        heading: 'Built for printing',
        body: 'The tool focuses on accurate spacing, crisp vector output, and practical templates that work from a browser.',
      },
      {
        heading: 'Why the site publishes reference pages',
        body: 'Many printable-paper searches are really sizing, comparison, or use-case questions. FreeGridPaper pairs the generator with stable reference pages so the measurement guidance and template recommendations can be indexed and cited directly.',
      },
    ],
  },
  {
    kind: 'site',
    id: 'contact',
    slug: 'contact',
    path: '/contact',
    canonicalPath: '/contact',
    indexable: true,
    title: 'Contact FreeGridPaper',
    description: 'Contact FreeGridPaper for questions, corrections, and template suggestions.',
    h1: 'Contact',
    summary: 'Send questions, corrections, and template suggestions for FreeGridPaper.',
    answerSummary: 'Use the published contact channels for corrections, template requests, or factual updates. FreeGridPaper treats measurement errors and print guidance corrections as high-priority fixes because they affect real-world output.',
    updatedAt,
    previewImage,
    socialImage,
    body: [
      {
        heading: 'Get in touch',
        body: 'For questions, corrections, or template ideas, contact Ellie Petal Media through the published contact channels for this site.',
      },
    ],
  },
  {
    kind: 'site',
    id: 'privacy',
    slug: 'privacy',
    path: '/privacy',
    canonicalPath: '/privacy',
    indexable: true,
    title: 'Privacy Policy | FreeGridPaper',
    description: 'Privacy information for FreeGridPaper and its browser-based PDF generator.',
    h1: 'Privacy Policy',
    summary: 'FreeGridPaper generates PDFs in your browser and stores custom settings locally on your device.',
    answerSummary: 'FreeGridPaper performs paper generation in the browser and stores saved settings locally on the device. This reduces the amount of personal content that needs to leave the user’s machine during normal use.',
    updatedAt,
    previewImage,
    socialImage,
    body: [
      {
        heading: 'Browser-based generation',
        body: 'Your paper settings are used locally to render previews and PDFs. Saved settings use browser storage on your device.',
      },
    ],
  },
];
