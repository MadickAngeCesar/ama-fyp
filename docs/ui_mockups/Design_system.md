# ASSS Design System (Visual Design Language)

> **Project:** AI‑powered Student Support System (ASSS)
>
> **Stack alignment:** Next.js (App Router) · shadcn/ui · Tailwind CSS · Clerk · Supabase
>
> **Theme:** Dark-first, accessible, calm, and trustworthy for academic environments

---

## 1. Design Principles

These principles guide all visual and interaction decisions.

1. **Clarity over decoration**  
   Students and staff should immediately understand what to do next.
2. **Calm & Trustworthy**  
   The system deals with complaints, support, and authority → avoid aggressive colors.
3. **Role-aware UI**  
   Same system, different mental models (Student vs Staff vs Admin).
4. **AI as an assistant, not the star**  
   The chatbot should feel helpful and safe, not flashy or intrusive.
5. **Accessibility by default**  
   WCAG 2.1 AA contrast, keyboard navigation, readable typography.

---

## 2. Color System

### 2.1 Color Strategy

- **Dark-first UI** to reduce eye strain and feel modern.
- **Neutral base** with restrained accent colors.
- **Semantic colors** for status, feedback, and alerts.

### 2.2 Core Palette (Dark Theme)

| Token | Usage | Hex |
|------|------|-----|
| `--background` | App background | `#0B0F14` |
| `--surface` | Cards, panels | `#121823` |
| `--surface-muted` | Secondary panels | `#1A2232` |
| `--border` | Dividers, outlines | `#273046` |
| `--text-primary` | Main text | `#E6EAF2` |
| `--text-secondary` | Subtext | `#A9B1C7` |
| `--text-muted` | Hints / placeholders | `#6B738A` |

### 2.3 Brand / Accent Colors

| Token | Usage | Hex |
|------|------|-----|
| `--primary` | Primary actions | `#4F7DFF` |
| `--primary-hover` | Hover state | `#3A66E8` |
| `--secondary` | Secondary actions | `#22C55E` |
| `--accent` | Highlights / AI | `#A78BFA` |

### 2.4 Semantic Colors

| State | Color |
|------|-------|
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |
| Info | `#38BDF8` |

### 2.5 Status Colors (Complaints)

| Status | Color |
|-------|-------|
| PENDING | `#F59E0B` |
| IN_PROGRESS | `#38BDF8` |
| RESOLVED | `#22C55E` |
| CLOSED | `#64748B` |

---

## 3. Typography

### 3.1 Font Stack

- **Primary:** `Inter` (default with shadcn/ui)
- **Fallback:** `system-ui, sans-serif`

### 3.2 Type Scale

| Role | Size | Weight |
|----|----|----|
| Page Title | `text-2xl` | 600 |
| Section Title | `text-xl` | 600 |
| Card Title | `text-lg` | 500 |
| Body | `text-sm` | 400 |
| Small / Meta | `text-xs` | 400 |

### 3.3 Text Usage Rules

- Avoid large blocks of text for students
- Prefer bullet points and summaries
- AI messages use slightly softer color (`text-secondary`)

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (Tailwind-based)

`2 · 4 · 6 · 8 · 12 · 16 · 24 · 32`

- Cards: `p-6`
- Forms: `space-y-4`
- Page padding: `px-6 py-6`

### 4.2 Grid & Structure

- Dashboard: **Sidebar + Header + Content**
- Max content width: `1280px`
- Cards arranged in responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)

---

## 5. Core Components (shadcn/ui aligned)

### 5.1 Navigation

**Sidebar**
- Fixed on desktop, drawer on mobile
- Shows role-specific links
- Active item uses `primary` accent bar

**Header**
- Page title
- Notifications
- User avatar (Clerk)

---

### 5.2 Buttons

| Variant | Usage |
|------|------|
| Primary | Main actions (Submit, Send) |
| Secondary | Secondary actions |
| Ghost | Inline / toolbar actions |
| Destructive | Delete / irreversible |

Rules:
- One primary button per view
- Destructive always requires confirmation

---

### 5.3 Forms

- Use `Label + Input + Helper/Error text`
- Required fields clearly marked
- Inline validation preferred

Special forms:
- Complaint form: step-by-step feel
- AI-assisted auto-fill clearly labeled

---

### 5.4 Cards

Used for:
- Complaints
- Suggestions
- AI responses
- Stats

Card anatomy:
- Title
- Meta (status, date)
- Content preview
- Actions

---

### 5.5 Tables & Lists (Staff)

- Dense but readable
- Sticky header
- Status badges
- Row actions revealed on hover

---

## 6. Chatbot & AI UI Language

### 6.1 Chat Layout

- Two-column on desktop (Chat + Context)
- Single-column on mobile

### 6.2 Message Styling

| Sender | Style |
|------|------|
| User | Right aligned, primary tint |
| AI | Left aligned, surface-muted |
| Staff | Left aligned, secondary tint |

### 6.3 AI Trust Indicators

- “AI-generated” label
- Escalation button always visible
- No fake typing indicators

---

## 7. Icons & Visual Language

- **Icon set:** lucide-react
- Icons are functional, not decorative
- Always paired with text for critical actions

---

## 8. Motion & Feedback

- Subtle transitions (`150–200ms`)
- No excessive animations
- Use motion to explain state change (loading, success)

Examples:
- Button loading spinner
- New notification pulse

---

## 9. Accessibility Guidelines

- Contrast ratio ≥ 4.5:1
- Keyboard navigation for all flows
- Focus rings visible
- ARIA labels for icons & inputs

---

## 10. Role-Based Visual Differences

### Student
- Softer language
- Fewer controls
- Emphasis on guidance & AI help

### Staff
- Dense information
- Filters & batch actions
- Clear ownership & status

### Admin
- Neutral tone
- Warning emphasis for destructive actions

---

## 11. Design Tokens (Example)

```css
:root {
  --background: #0B0F14;
  --surface: #121823;
  --border: #273046;
  --primary: #4F7DFF;
  --text-primary: #E6EAF2;
}
```

---

## 12. Do & Don’t

**Do**
- Keep interfaces predictable
- Respect emotional context (complaints)
- Make AI optional, not forced

**Don’t**
- Overuse color
- Hide system status
- Make AI decisions opaque

---

## 13. Future Extensions

- Light theme variant
- Institutional branding overrides
- Design token export (JSON)
- Figma ↔ code sync

---

**End of Design System**

