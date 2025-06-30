-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    job_type TEXT NULL,
    location JSONB NOT NULL,
    pay_type TEXT NULL,
    min_amount NUMERIC,
    max_amount NUMERIC,
    amount NUMERIC,
    pay_rate TEXT  NULL,
    requirements TEXT[],
    skills TEXT[],
    responsibilities TEXT[],
    perks TEXT[],
    application_deadline TIMESTAMP WITH TIME ZONE,
    status TEXT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NULL
);

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_internships_updated_at ON internships;

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access to active internships" ON internships;
DROP POLICY IF EXISTS "Allow authenticated users to create internships" ON internships;
DROP POLICY IF EXISTS "Allow users to update their own internships" ON internships;

-- Drop existing table
DROP TABLE IF EXISTS internships CASCADE;

-- Create internships table
CREATE TABLE internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    stipend TEXT NOT NULL,
    requirements JSONB NULL,
    responsibilities JSONB NULL,
    skills JSONB NULL,
    perks JSONB NULL,
    application_deadline TIMESTAMP WITH TIME ZONE NULL,
    start_date TIMESTAMP WITH TIME ZONE NULL,
    end_date TIMESTAMP WITH TIME ZONE NULL,
    status TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

-- Enable RLS
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_internships_updated_at
    BEFORE UPDATE ON internships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create policies
CREATE POLICY "Allow public read access to active internships"
    ON internships FOR SELECT
    USING (status = 'active');

CREATE POLICY "Allow authenticated users to create internships"
    ON internships FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own internships"
    ON internships FOR UPDATE
    TO authenticated
    USING (auth.uid() = company_id)
    WITH CHECK (auth.uid() = company_id);

-- Create RLS policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active jobs and internships
CREATE POLICY "Allow public read access to active jobs"
    ON jobs FOR SELECT
    USING (status = 'active');

-- Allow authenticated users to create jobs
CREATE POLICY "Allow authenticated users to create jobs"
    ON jobs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow users to update their own jobs
CREATE POLICY "Allow users to update their own jobs"
    ON jobs FOR UPDATE
    TO authenticated
    USING (auth.uid() = company_id)
    WITH CHECK (auth.uid() = company_id); 