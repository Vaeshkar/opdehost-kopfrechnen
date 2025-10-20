# Next.js Website Conversion Plan - Grundschule Op de Host

## 🎯 Project Overview

Convert the existing Grundschule Op de Host website (https://gsopdehost.lernnetz.de/) from Contao CMS to a modern Next.js application.

---

## 📊 Current Website Analysis

### Technology Stack (Current)
- **CMS**: Contao CMS (German CMS system)
- **Structure**: Traditional server-rendered pages
- **Layout**: Fixed width (1000px), left sidebar navigation
- **Features**: News/blog system, calendar, file downloads, image galleries

### Main Sections Identified
1. **Startseite** (Homepage) - News feed, "Kinderrecht des Monats", upcoming events
2. **Unsere Schule** - About the school, team, gallery, supporters
3. **Unser OGT** - After-school program (Offene Ganztagsschule)
4. **Für Eltern** - Parent resources, forms, downloads, school ABC
5. **Für Pädagogen** - Teacher resources, hospitality, school program
6. **Schulverein** - School association
7. **Termine** - Calendar/events

---

## 🏗️ Proposed Next.js Architecture

### Technology Stack

#### Frontend
- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (for modern, responsive design)
- **shadcn/ui** (component library)

#### Content Management
**Option A: Headless CMS**
- Sanity.io (great for German schools, visual editing)
- Strapi (open source, self-hosted option)
- Contentful (enterprise-grade)

**Option B: File-based CMS**
- MDX files (Markdown + React components)
- Git-based workflow (teachers edit via GitHub/GitLab)

#### Hosting
- **Vercel** (automatic deployments, great Next.js support)
- **Netlify** (alternative)

#### Additional Tools
- next-intl (if multilingual support needed)
- react-pdf (for PDF downloads)
- framer-motion (smooth animations)

---

## 📁 Site Structure

```
/
├── app/
│   ├── (main)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── unsere-schule/
│   │   │   ├── page.tsx               # About school
│   │   │   ├── galerie/page.tsx       # Gallery
│   │   │   ├── team/page.tsx          # School team
│   │   │   └── aktuelles/
│   │   │       ├── page.tsx           # News list
│   │   │       └── [slug]/page.tsx    # Individual news article
│   │   ├── ogt/
│   │   │   ├── page.tsx               # After-school program
│   │   │   ├── team/page.tsx
│   │   │   └── angebote/page.tsx
│   │   ├── eltern/
│   │   │   ├── page.tsx
│   │   │   ├── leitbild/page.tsx
│   │   │   ├── schul-abc/page.tsx
│   │   │   └── downloads/page.tsx
│   │   ├── paedagogen/
│   │   │   └── page.tsx
│   │   ├── termine/page.tsx           # Calendar
│   │   └── kontakt/page.tsx           # Contact
│   ├── api/
│   │   ├── news/route.ts              # News API
│   │   └── events/route.ts            # Events API
│   └── layout.tsx                      # Root layout
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsList.tsx
│   │   └── NewsDetail.tsx
│   ├── calendar/
│   │   ├── EventCard.tsx
│   │   └── Calendar.tsx
│   └── ui/                             # shadcn/ui components
├── lib/
│   ├── cms.ts                          # CMS integration
│   └── utils.ts
└── public/
    ├── images/
    └── downloads/
```

---

## ✨ Key Features to Implement

### Must-Have Features

#### 1. Responsive Design
- Mobile-first approach
- Works on tablets, phones, desktops
- Touch-friendly navigation

#### 2. News/Blog System
- Paginated news feed
- Individual article pages
- Categories/tags
- Search functionality

#### 3. Calendar/Events
- Upcoming events display
- Calendar view
- Event details pages
- iCal export

#### 4. Downloads Section
- PDF forms and documents
- Organized by category
- File size display
- Download tracking

#### 5. Image Galleries
- Lightbox functionality
- Lazy loading
- Responsive images
- Alt text for accessibility

#### 6. Contact Forms
- Email integration
- Form validation
- GDPR-compliant

### Design Improvements

#### 1. Modern, Clean Design
- Remove fixed 1000px width → responsive
- Better typography
- Improved color scheme (keep school colors)
- Card-based layouts

#### 2. Accessibility (WCAG 2.1 AA)
- Keyboard navigation
- Screen reader support
- High contrast mode
- Proper heading hierarchy

#### 3. Performance
- Image optimization (Next.js Image component)
- Code splitting
- Fast page loads
- SEO optimization

---

## 🔄 Content Migration Strategy

### Phase 1: Content Audit
- Export all existing content from Contao
- Catalog all images, PDFs, documents
- Map current URLs to new structure
- Identify outdated content

### Phase 2: CMS Setup
- Choose CMS (Recommendation: Sanity.io for schools)
- Create content models:
  - News articles
  - Events
  - Team members
  - Downloads
  - Pages

### Phase 3: Content Migration
- Import news articles
- Upload images to CDN
- Organize downloads
- Set up redirects from old URLs

---

## 🎓 Special Features for Schools

### 1. "Kinderrecht des Monats" Widget
- Rotating display
- Archive of past months
- UNICEF integration

### 2. Team Directory
- Teacher profiles
- Photos
- Contact information
- Roles/responsibilities

### 3. Parent Portal (Future Enhancement)
- Login system
- Class-specific information
- Direct messaging
- Document access

### 4. OGT (After-School) Section
- Program descriptions
- Registration forms
- Photo galleries
- Activity calendar

---

## 📅 Development Phases

### Phase 1: Foundation (2-3 weeks)
- Set up Next.js project
- Create basic layout (header, nav, footer)
- Implement homepage
- Set up CMS

### Phase 2: Core Pages (2-3 weeks)
- "Unsere Schule" section
- "Für Eltern" section
- News system
- Calendar/events

### Phase 3: Additional Sections (2 weeks)
- OGT section
- Pädagogen section
- Downloads
- Contact forms

### Phase 4: Polish & Launch (1-2 weeks)
- Testing
- Content migration
- SEO optimization
- Training for teachers
- Launch!

---

## ❓ Questions to Answer Before Starting

### 1. CMS Preference
- Do you want teachers to edit content easily via a visual editor? (→ Sanity/Strapi)
- Or are you comfortable with Markdown files in Git? (→ MDX)
- Budget for CMS? (Sanity free tier is generous, Strapi is self-hosted)

### 2. Design
- Keep similar look/feel or completely redesign?
- Any specific color scheme/branding guidelines?
- Do you have a logo in vector format?

### 3. Content
- Who will migrate the content? (You, teachers, or should I help?)
- How often is content updated? (Daily, weekly, monthly?)
- Who will maintain the site after launch?

### 4. Features
- Do you need a parent login system?
- Should the Kopfrechnen Trainer be integrated into this site?
- Any other interactive tools needed?

### 5. Timeline
- When do you need this live?
- Is there a specific event/deadline?

### 6. Hosting
- Vercel (free for schools, automatic deployments)?
- Or keep on lernnetz.de infrastructure?

---

## 💡 Recommendations

### For a school website, recommended stack:

#### 1. Next.js 14 + Sanity.io
- Teachers can edit content visually
- Real-time preview
- Free tier is generous
- Great for images/documents

#### 2. Tailwind CSS + shadcn/ui
- Modern, accessible components
- Fast development
- Easy to customize

#### 3. Vercel Hosting
- Free for non-commercial
- Automatic deployments from Git
- Great performance
- Easy rollbacks

#### 4. Responsive, Mobile-First Design
- Parents check on phones
- Modern look
- Fast loading

---

## 🔗 Integration Opportunities

### Kopfrechnen Trainer Integration
- Add as `/tools/kopfrechnen` route
- Link from "Für Eltern" section
- Embed in relevant pages
- Share progress/achievements

### Future Enhancements
- Parent portal with authentication
- Class-specific pages
- Online registration forms
- Newsletter system
- Photo upload for parents
- Event RSVP system

---

## 📝 Notes

- Current website: https://gsopdehost.lernnetz.de/
- School: Grundschule Op de Host, Horst (near Elmshorn)
- ~240 students, 10 mixed-age classes
- Focus on accessibility and ease of use for parents and teachers
- GDPR compliance is essential (German school)

---

**Status**: Planning phase - awaiting feedback and decisions on CMS, design direction, and timeline.

