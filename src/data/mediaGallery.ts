import type { MediaItem } from '@/types';

export const MEDIA_CATEGORIES = ['All', 'Activities', 'Awards', 'Certificates', 'Officers'] as const;

export const MEDIA_ITEMS: MediaItem[] = [
  // Awards
  {
    id: 'award-1',
    title: 'Best Overall Project Award',
    category: 'Awards',
    src: '/imgs/Awards/BESTPROJECTOVERALL.jpg',
    subtitle: 'Champion recognition for technical innovation and project execution.'
  },
  {
    id: 'award-2',
    title: 'Best Use of AI Award',
    category: 'Awards',
    src: '/imgs/Awards/BESTUSEOFAI.jpg',
    subtitle: 'Special recognition for advanced artificial intelligence integration.'
  },
  {
    id: 'award-3',
    title: 'Community Favorite Award',
    category: 'Awards',
    src: '/imgs/Awards/COMMUNITYFAVORITE.png',
    subtitle: 'Voted #1 by campus student delegates and tech enthusiasts.'
  },

  // Officers
  {
    id: 'officers-1',
    title: 'CSO Executive Officers, Committee Heads, & Mayors (2025-2026)',
    category: 'Officers',
    src: '/imgs/CSO Officers.jpg',
    subtitle: 'Leading the Computer Studies Organization towards tech excellence.'
  },

  // All Documented Activities
  {
    id: 'act-dosthub-1',
    title: 'DOST Hub Innovation Showcase',
    category: 'Activities',
    src: '/imgs/Activities/DOSTHUB/DOSTHUB1.jpg',
    subtitle: 'CSO Delegation presenting technical projects at DOST Hub.'
  },
  {
    id: 'act-dosthub-2',
    title: 'DOST Hub Tech Expo',
    category: 'Activities',
    src: '/imgs/Activities/DOSTHUB/DOSTHUB2.jpg',
    subtitle: 'Demonstrating student prototypes and research at the DOST Hub Expo.'
  },
  {
    id: 'act-ethph-1',
    title: 'ETHPH Web3 & Blockchain',
    category: 'Activities',
    src: '/imgs/Activities/ETHPH/ETHPH.jpg',
    subtitle: 'CSO members attending ETHPH Web3 developer conference.'
  },
  {
    id: 'act-jscebu-1',
    title: 'JS Cebu Tech Meetup - Workshop',
    category: 'Activities',
    src: '/imgs/Activities/JSCEBU/JSCEBU1.jpg',
    subtitle: 'JavaScript community learning & mentorship session.'
  },
  {
    id: 'act-jscebu-2',
    title: 'JS Cebu Developer - Group Photo',
    category: 'Activities',
    src: '/imgs/Activities/JSCEBU/JSCEBU2.jpg',
    subtitle: 'CSO student developers networking at JS Cebu.'
  },
  {
    id: 'act-jscebu-3',
    title: 'JS Cebu Tech Conference - Keynote Session',
    category: 'Activities',
    src: '/imgs/Activities/JSCEBU/JSCEBU3.jpg',
    subtitle: 'Attending expert talks on frontend & backend web frameworks.'
  },
  {
    id: 'act-jscebu-4',
    title: 'JS Cebu Community Gathering',
    category: 'Activities',
    src: '/imgs/Activities/JSCEBU/JSCEBU4.jpg',
    subtitle: 'Engaging with Cebu tech industry professionals and mentors.'
  },
  {
    id: 'act-networking-1',
    title: 'Networking with foreign Senior Developers',
    category: 'Activities',
    src: '/imgs/Activities/Networking1.jpg',
    subtitle: 'Discussing WEB3 implementation and mentorship with foriegn WEB3 Developers'
  },
  {
    id: 'act-school-1',
    title: 'Networking Committee Bootcamp - Sir Ryan Prudenciado',
    category: 'Activities',
    src: '/imgs/Activities/School/CSO damn_2.jpg',
    subtitle: 'Networking Committee hosted a Bootcamp focused on IT'
  },
  {
    id: 'act-school-2',
    title: 'CSO Student Workshop Session',
    category: 'Activities',
    src: '/imgs/Activities/School/Random Pic1.jpg',
    subtitle: 'Interactive student collaboration & tech tool sharing.'
  },
  {
    id: 'act-sports-1',
    title: 'Badminton with Mentors and Senior Developers',
    category: 'Activities',
    src: '/imgs/Activities/Sports/Badminton1.jpg',
    subtitle: 'Playing Badminton after a long session on AI and programming'
  },

  // Certificates
  {
    id: 'cert-1',
    title: 'Hacktoberfest 2025 Certificate - Alicaba',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-ALICABA.png',
    subtitle: 'Hackathon Participant & Winner'
  },
  {
    id: 'cert-2',
    title: 'Hacktoberfest 2025 Certificate - Cez',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-CEZ.png',
    subtitle: 'Hackathon Participant & Winner'
  },
  {
    id: 'cert-3',
    title: 'Hacktoberfest 2025 Certificate - Chavez',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-CHAVEZ.png',
    subtitle: 'Hackathon Participant'
  },
  {
    id: 'cert-4',
    title: 'Hacktoberfest 2025 Certificate - Elgin',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-ELGIN.png',
    subtitle: 'Hackathon Participant'
  },
  {
    id: 'cert-5',
    title: 'Hacktoberfest 2025 Certificate - Mangyaw',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-MANGYAW.png',
    subtitle: 'Hackathon Participant'
  },
  {
    id: 'cert-6',
    title: 'Hacktoberfest 2025 Certificate - Manuel',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-MANUEL.png',
    subtitle: 'Hackathon Participant'
  },
  {
    id: 'cert-7',
    title: 'Hacktoberfest 2025 Certificate - Neil',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-NEIL.png',
    subtitle: 'Hackathon Participant & Winner'
  },
  {
    id: 'cert-8',
    title: 'Hacktoberfest 2025 Certificate - Melecio',
    category: 'Certificates',
    src: '/imgs/Certificates/HACKTOBERFEST2025-MELECIO.png',
    subtitle: 'Hackathon Participant & Winner'
  },
  {
    id: 'cert-9',
    title: 'VJAL Certificate - Kent',
    category: 'Certificates',
    src: '/imgs/Certificates/VJAL-KENT.png',
    subtitle: 'Participating in AI for Teams Workshop'
  },
  {
    id: 'cert-10',
    title: 'VJAL Certificate - Melecio',
    category: 'Certificates',
    src: '/imgs/Certificates/VJAL-MELECIO.png',
    subtitle: 'Participating in AI for Teams Workshop'
  }
];
