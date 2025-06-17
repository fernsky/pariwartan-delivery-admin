CREATE TABLE IF NOT EXISTS ward_wise_agriculture_firm_count (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL CHECK (ward_number > 0),
    count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ward_number)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ward_wise_agriculture_firm_count_ward_number 
ON ward_wise_agriculture_firm_count(ward_number);

-- Insert sample data
INSERT INTO ward_wise_agriculture_firm_count (ward_number, count) VALUES
(1, 6),
(2, 17),
(3, 11),
(4, 16),
(5, 6),
(6, 8)
ON CONFLICT (ward_number) DO NOTHING;

-- Create ACME table for fallback data
CREATE TABLE IF NOT EXISTS acme_ward_wise_agriculture_firm_count (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert data into ACME table
INSERT INTO acme_ward_wise_agriculture_firm_count (ward_number, count) VALUES
(1, 6),
(2, 17),
(3, 11),
(4, 16),
(5, 6),
(6, 8)
ON CONFLICT DO NOTHING;
