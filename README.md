# galsaril.com - Personal Portfolio Site

Professional homepage for Gal Sar Israel - DevOps, Automation & Test Engineer.

Live at: **https://galsaril.com** | **https://www.galsaril.com**
GitHub: **https://github.com/GalSarIL/portfolio**

---

## Stack

- **Frontend**: Vanilla HTML / CSS / JavaScript (no frameworks, no build step)
- **Fonts**: Inter + Fira Code via Google Fonts
- **Hosting**: Cloudflare Pages (free tier, unlimited requests)
- **Domain**: galsaril.com (GoDaddy, DNS managed by Cloudflare)
- **SSL**: Cloudflare Universal SSL (automatic, free)
- **CI/CD**: Local Jenkins polling this GitHub repo, deploys to Cloudflare Pages on push

---

## Project Structure

```
portfolio/              <- this repo (github.com/GalSarIL/portfolio)
├── Jenkinsfile         # CI/CD pipeline: checkout → deploy → smoke test
├── wrangler.toml       # Cloudflare Pages project config
├── README.md
└── site/
    ├── index.html      # Single-page homepage
    ├── css/
    │   └── style.css   # Dark theme, responsive layout
    └── js/
        └── main.js     # Particles, typing effect, scroll animations

../                     <- local dev only, not in repo
├── docker-compose.yml  # Runs nginx (site preview) + Jenkins locally
├── nginx.conf
└── Dockerfile.jenkins  # Jenkins + Node.js + Wrangler CLI
```

---

## Site Sections

| Section | Description |
|---|---|
| Hero | Name, animated role titles, stats (11+ yrs, 2 companies, 3 disciplines) |
| About | Bio + highlight cards (DevOps, Automation, B.Sc CS) |
| Experience | Timeline - Imperva/Thales (current) + Elbit Systems |
| Skills | 6 categories - Cloud, DevOps, Automation, Security, Programming, Tools |
| Certifications | Terraform + Python Automation (LinkedIn Learning, 2022) |
| Contact | Email, LinkedIn, GitHub |

---

## Local Development

Local dev setup lives outside this repo. Requires Docker Desktop (configured to auto-start on login).

```bash
# From the parent opt/ directory
docker compose up -d

# Site preview
http://localhost:8080

# Jenkins
http://localhost:8081
```

Changes to `site/` reflect immediately on browser refresh (volume mount, no rebuild needed).

---

## CI/CD Pipeline

Jenkins runs locally and polls this GitHub repo every minute.
On any push to `main`, the pipeline runs three stages:

1. **Checkout** — pulls latest from GitHub
2. **Deploy** — pushes `site/` to Cloudflare Pages via Wrangler CLI
3. **Smoke Test** — verifies HTTP 200 and expected content on live site

**Required Jenkins credentials (stored in Jenkins, never in code):**

| ID | Description |
|---|---|
| `cloudflare-api-token` | Cloudflare API token with Pages:Write permission |
| `cloudflare-account-id` | Cloudflare Account ID (`bd6ba2ce028cbe4fa971a70335b715bf`) |

**Jenkins jobs:**

| Job | Purpose |
|---|---|
| `portfolio-deploy` | Main deploy pipeline, triggered on SCM change |
| `site-monitor` | Hourly uptime check — fails build if site returns non-200 |

---

## Domain Setup

- Domain registered at **GoDaddy**
- Nameservers pointed to **Cloudflare**
- Cloudflare manages DNS, CDN, DDoS protection, and SSL
- `galsaril.com` and `www.galsaril.com` both connected as custom domains on Cloudflare Pages
- HTTPS via Cloudflare Universal SSL

---

## TODO

- [ ] Add profile photo
- [ ] Projects section
- [ ] Contact form
- [ ] Blog / articles page
- [ ] Slack/email alert on monitor failure
- [ ] PR preview deployments
