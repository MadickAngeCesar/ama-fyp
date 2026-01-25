
# AI-Powered Student Support System (ASSS)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://ama-fyp.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/MadickAngeCesar/ama-fyp)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

A comprehensive web-based platform that empowers students to submit complaints and suggestions while providing an AI-powered chatbot for immediate assistance. Staff members can efficiently manage and resolve issues through an intuitive administrative dashboard.

## 🌟 Features

### For Students
- **Complaint Submission**: Submit detailed complaints with categories, descriptions, and file attachments
- **Suggestion System**: Share ideas and vote on community suggestions
- **AI-Powered Chatbot**: Get instant help from Gemini AI with contextual support
- **Real-time Notifications**: Stay updated on complaint status changes
- **Responsive Design**: Seamless experience across desktop and mobile devices

### For Staff
- **Complaint Management**: View, filter, assign, and resolve student complaints
- **Suggestion Review**: Moderate and respond to student suggestions
- **Chat Support**: Assist students through integrated chat sessions
- **Analytics Dashboard**: Monitor resolution rates and system performance
- **Bulk Operations**: Efficiently handle multiple items with advanced filtering

### For Administrators
- **User Management**: Create, edit, and manage user accounts and roles
- **Audit Logging**: Comprehensive system activity tracking
- **Configuration**: Customize categories, retention policies, and system settings
- **System Monitoring**: Oversee platform health and user engagement

## 🚀 Tech Stack

- **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Authentication**: Clerk for secure user management
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Supabase for live updates and file storage
- **AI Integration**: Google Gemini API for chatbot functionality
- **Deployment**: Vercel for seamless hosting
- **Testing**: Jest for comprehensive test coverage
- **Internationalization**: react-i18next for multi-language support

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js 18+ and pnpm
- PostgreSQL database
- Supabase account
- Clerk account
- Google Gemini API access

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MadickAngeCesar/ama-fyp.git
   cd ama-fyp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ama_fyp"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"

   # Gemini AI
   GEMINI_API_KEY="your-gemini-api-key"

   # Next.js
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run migrations
   pnpm prisma migrate dev

   # Seed the database
   pnpm prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Student Portal
1. Sign up or sign in using Clerk authentication
2. Submit complaints with detailed descriptions and attachments
3. Share suggestions and vote on community ideas
4. Chat with the AI assistant for immediate help
5. Track the status of your submissions in real-time

### Staff Portal
1. Access the staff dashboard to view pending items
2. Filter and assign complaints to team members
3. Respond to student inquiries and update statuses
4. Moderate suggestions and provide feedback
5. Monitor chat sessions and provide support

### Admin Portal
1. Manage user accounts and role assignments
2. Review audit logs for system activity
3. Configure complaint categories and system settings
4. Monitor platform analytics and performance

## 🏗️ Project Structure

```
ama-fyp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── (protected)/              # Protected routes by role
│   │   ├── admin/                # Admin dashboard
│   │   ├── staff/                # Staff dashboard
│   │   └── students/             # Student dashboard
│   ├── (public)/                 # Public pages
│   └── api/                      # API route handlers
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   └── chat/                     # Chat-related components
├── lib/                          # Utility functions
│   ├── generated/prisma/         # Prisma client
│   ├── supabase/                 # Supabase utilities
│   └── validations/              # Form validations
├── prisma/                       # Database schema and seeds
├── public/                       # Static assets
│   └── locales/                  # Internationalization files
├── docs/                         # Documentation
└── __tests__/                    # Test files
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Tests include:
- Unit tests for utilities and components
- Integration tests for API routes
- End-to-end tests with Cypress

## 🚀 Deployment

The application is deployed on Vercel at [https://ama-fyp.vercel.app](https://ama-fyp.vercel.app).

### Environment Variables for Production

Ensure these environment variables are set in your Vercel project:

- `DATABASE_URL`: Production PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `GEMINI_API_KEY`: Google Gemini API key
- `NEXT_PUBLIC_APP_URL`: Production URL

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

## 🌐 Internationalization

The application supports multiple languages:
- English (en)
- French (fr)

Language files are located in `public/locales/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance (WCAG 2.1 AA)
- Use conventional commits

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Complaint Endpoints
- `GET /api/complaints` - List complaints (filtered by role)
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/[id]` - Update complaint
- `DELETE /api/complaints/[id]` - Delete complaint

### Chat Endpoints
- `POST /api/chat` - Send message to AI
- `GET /api/chat/sessions` - Get chat sessions

### Admin Endpoints
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `GET /api/admin/audit` - Get audit logs

## 📊 Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts with roles (STUDENT, STAFF, ADMIN)
- **Complaint**: Student complaints with status tracking
- **Suggestion**: Student suggestions with voting
- **AuditLog**: System activity logging
- **ChatSession**: AI chat conversations
- **Message**: Individual chat messages

## 🔒 Security

- Authentication handled by Clerk
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- Input validation and sanitization
- Rate limiting on API endpoints
- Audit logging for sensitive operations

## 📈 Performance

- Server-side rendering with Next.js
- Optimized database queries with Prisma
- Real-time updates via Supabase
- Image optimization and lazy loading
- Code splitting and bundle optimization

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Run `pnpm prisma migrate deploy`

2. **Authentication Problems**
   - Check Clerk configuration
   - Verify environment variables
   - Clear browser cache

3. **Build Failures**
   - Run `pnpm prisma generate`
   - Check TypeScript errors
   - Verify all dependencies are installed

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Supabase for real-time database and storage
- Clerk for authentication
- Google for Gemini AI
- All contributors and the open-source community

---

**Live Demo**: [https://ama-fyp.vercel.app](https://ama-fyp.vercel.app)

**Repository**: [https://github.com/MadickAngeCesar/ama-fyp](https://github.com/MadickAngeCesar/ama-fyp)
