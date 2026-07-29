# Elvora-X — Luxury Home Care Website (PRD)

## Problem Statement
Premium marketing website for Elvora-X (Nimishika Ventures LLP), a floor cleaner & home care
manufacturer. Showcases flagship products (Forest Blossom, Forest Dew, Royal Forest) with a
luxury "Spotless and Pure" aesthetic. Enquiry-based (no e-commerce v1) + protected admin panel.

## Stack
React + Framer Motion + Lenis (smooth scroll) + react-fast-marquee, Tailwind, Shadcn UI.
FastAPI + MongoDB. JWT Bearer auth (single admin). Product images cropped from the brand
reference image (authentic bottles) in `/app/frontend/src/assets`.

## User Choices
- No email notifications (enquiries saved to DB only)
- Admin panel required (protected)
- Real business address (Bangalore) + embedded Google map
- Design: award-worthy, kinetic hero (masked reveal), parallax bottles, editorial marquee,
  numbered manifesto chapters, framer-motion scroll reveals.

## Personas
Retail consumers, B2B/bulk buyers, distributors, professional cleaning services, admin.

## Implemented (2025-12)
- Marketing landing: Header (glass, sticky, anchor scroll), Hero (masked line reveal + parallax
  product bottles + pillar badges + CTA), Editorial marquee, Product showcase (3 cards + luxury
  detail modal), Features bento grid, About numbered chapters, Sustainability/Make-in-India
  (lion emblem), Contact (form + info + map), Footer (quality strip, watermark, social).
- Backend: GET /api/products, POST /api/enquiries, JWT auth (/api/auth/login, /me),
  protected /api/enquiries (list/stats/patch/delete). Admin seeded on startup.
- Admin: /admin/login + /admin dashboard (stats, table, mark-read, delete, logout).
- All flows tested (backend curl + frontend screenshots). Critical id-serialization bug fixed.

## Credentials
admin@elvora-x.com / Elvora@2025 (see /app/memory/test_credentials.md)

## Backlog
- P1: Email notifications on enquiry (Resend), product image object storage, blog/SEO section.
- P2: Razorpay/Stripe checkout, distributor login portal, multi-language (Hindi), reviews module.
