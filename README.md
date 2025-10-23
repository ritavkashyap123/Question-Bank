# Question Bank - Educational Resource Platform

A modern web application for managing and downloading question papers built with Next.js, Supabase, and Tailwind CSS. This platform allows students to browse and download question papers while providing admins with a comprehensive dashboard for managing educational resources.

## Features

### Public Features
- **Browse Question Papers**: View all available question papers with filtering options
- **Advanced Filtering**: Filter by subject, year, district, set, and search by title/description
- **Download Tracking**: Automatic download count tracking for each question paper
- **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- **Secure Authentication**: OTP-based login system for admins
- **Question Bank Management**: Create, edit, and delete question papers
- **File Upload**: Upload PDF files to Supabase Storage
- **Admin Dashboard**: Comprehensive dashboard for managing all resources
- **Download Analytics**: Track download statistics for each question paper

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom green/emerald color scheme
- **Backend**: Supabase (Database, Authentication, Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd dapoon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Set up Database

Run the following SQL queries in your Supabase SQL editor:

#### Create Tables
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin Table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Question Bank Table
CREATE TABLE question_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  year INT NOT NULL,
  district TEXT,
  set TEXT,
  url TEXT NOT NULL,
  downloads INT DEFAULT 0,
  uploaded_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Enable Row Level Security
```sql
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
```

#### Create Security Policies
```sql
-- Admin policies
CREATE POLICY "Admins can view their own record"
ON admins
FOR SELECT
USING (auth.email() = email);

CREATE POLICY "Admins can update their own record"
ON admins
FOR UPDATE
USING (auth.email() = email);

-- Question bank policies
CREATE POLICY "Anyone can view question banks"
ON question_banks
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert question banks"
ON question_banks
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM admins WHERE email = auth.email()
));

CREATE POLICY "Admins can update their own uploads"
ON question_banks
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = question_banks.uploaded_by AND admins.email = auth.email()
));

CREATE POLICY "Admins can delete their own uploads"
ON question_banks
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM admins WHERE admins.id = question_banks.uploaded_by AND admins.email = auth.email()
));

CREATE POLICY "Public can increment downloads"
ON question_banks
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (
  downloads IS DISTINCT FROM question_banks.downloads
  AND title = question_banks.title
  AND description IS NOT DISTINCT FROM question_banks.description
  AND subject = question_banks.subject
  AND year = question_banks.year
  AND district IS NOT DISTINCT FROM question_banks.district
  AND url = question_banks.url
  AND uploaded_by = question_banks.uploaded_by
);
```

### 5. Set up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `question_bank_files`
3. Set the bucket to public
4. Add the following storage policies:

```sql
-- Storage policies
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'question_bank_files');

CREATE POLICY "Admins can upload question bank files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'question_bank_files' AND
  EXISTS (
    SELECT 1 FROM admins WHERE email = auth.email()
  )
);

CREATE POLICY "Admins can delete their own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'question_bank_files' AND
  EXISTS (
    SELECT 1 FROM admins WHERE email = auth.email()
  )
);
```

### 6. Add Admin Users

Insert admin users into the admins table:

```sql
INSERT INTO admins (name, email, phone) VALUES
('Admin User', 'admin@example.com', '+1234567890');
```

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Students
1. Visit the homepage to browse available question papers
2. Use the filter options to find specific papers by subject, year, district, etc.
3. Click the download button to download any question paper
4. Download counts are automatically tracked

### For Admins
1. Go to `/admin/login` and enter your registered email
2. Check your email for the OTP and enter it to log in
3. Access the admin dashboard at `/admin/dashboard`
4. Use the "Add Question Bank" button to upload new question papers
5. Edit or delete existing question papers as needed

## Deployment

The application is ready for deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

## Customization

The application uses a green/emerald color scheme throughout. You can customize the colors by modifying the Tailwind CSS classes in the components.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
