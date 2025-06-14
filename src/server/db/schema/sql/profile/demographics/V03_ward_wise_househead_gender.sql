-- Set UTF-8 encoding for this script
SET client_encoding = 'UTF8';

-- Create acme_age_group_househead table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'acme_age_group_househead') THEN
        CREATE TABLE acme_age_group_househead (
            id VARCHAR(36) PRIMARY KEY,
            age_group VARCHAR(50) NOT NULL UNIQUE,
            male_heads INTEGER NOT NULL DEFAULT 0,
            female_heads INTEGER NOT NULL DEFAULT 0,
            total_families INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Create index for faster lookups by age group
        CREATE INDEX idx_age_group_househead ON acme_age_group_househead(age_group);
    END IF;
END
$$;

-- Seed data for age-group-wise household heads
DO $$
BEGIN
    -- Clear existing data first
    DELETE FROM acme_age_group_househead;
    
    -- Insert fresh data
    INSERT INTO acme_age_group_househead (id, age_group, male_heads, female_heads, total_families)
    VALUES
    (gen_random_uuid(), '10-14', 4, 4, 8),
    (gen_random_uuid(), '15-19', 20, 26, 46),
    (gen_random_uuid(), '20-29', 198, 294, 492),
    (gen_random_uuid(), '30-39', 586, 486, 1072),
    (gen_random_uuid(), '40-49', 663, 399, 1062),
    (gen_random_uuid(), '50-59', 696, 248, 944),
    (gen_random_uuid(), '60-69', 477, 171, 648),
    (gen_random_uuid(), '70 वर्ष माथि', 269, 141, 410),
    (gen_random_uuid(), 'जम्मा', 2913, 1769, 4682);
END
$$;
