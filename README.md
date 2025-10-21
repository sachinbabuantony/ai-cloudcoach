# CloudCert Mastery

An open-source daily learning platform for cloud certification preparation. Built for everyone pursuing AWS, Azure, or Google Cloud certifications.

## About This Project

I'm making this open source for everyone who wants to be cloud certified. Study consistently, build streaks, and master cloud certifications through daily practice.

## Features

- **Daily Learning Sessions** - Answer 10 questions per day to maintain your streak
- **Multiple Certifications** - Support for AWS, Azure, and Google Cloud certifications
- **Streak Tracking** - Build momentum with daily streaks and accountability
- **AI-Powered Questions** - Generate realistic exam questions using AI
- **Progress Analytics** - Track your performance and improvement over time
- **Gamification** - Stay motivated with streaks and achievements

## How It Works

1. **Sign up** and select your target certification
2. **Study daily** by answering 10 questions
3. **Build streaks** by maintaining consistent daily practice
4. **Track progress** with detailed analytics and performance metrics

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: OpenRouter API (Claude 3.5 Sonnet for question generation)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenRouter API key (for AI question generation)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cloudcert-mastery
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Set up the database:

The Supabase migrations are in `supabase/migrations/`. Apply them to your Supabase project.

5. Run the development server:
```bash
npm run dev
```

## Admin Features

### AI Question Generator

Generate questions automatically using AI:

1. Visit `/?admin=ai` to access the AI question generator
2. Select a certification
3. Generate a syllabus or create questions for specific topics
4. AI will create realistic exam questions with explanations

### Manual Question Entry

Add questions manually:

1. Visit `/?admin=manual` to access the admin panel
2. Enter question details, options, and explanations
3. Questions are saved to the database

## Database Schema

Key tables:
- `certifications` - Available cloud certifications
- `questions` - Question bank with answers and explanations
- `user_profiles` - User data, streaks, and progress
- `user_sessions` - Daily study session records
- `user_answers` - Individual answer tracking

## Contributing

Contributions are welcome! This project is open source to help the cloud certification community.

### Ways to Contribute

- Add more certification exams
- Improve question quality
- Add new features
- Fix bugs
- Improve documentation

## License

This project is open source and available for anyone pursuing cloud certifications.

## Acknowledgments

Built for the cloud certification community. Good luck with your certification journey!

---

**Made with ❤️ for cloud learners everywhere**
