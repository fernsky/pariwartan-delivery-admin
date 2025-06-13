-- Check if caste_population table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_caste_population'
    ) THEN
        CREATE TABLE acme_caste_population (
            id VARCHAR(36) PRIMARY KEY,
            caste_type VARCHAR(100) NOT NULL,
            male_population INTEGER NOT NULL DEFAULT 0,
            female_population INTEGER NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_caste_population) THEN
        INSERT INTO acme_caste_population (
            id, caste_type, male_population, female_population
        )
        VALUES
        (gen_random_uuid(), 'chhetri', 3729, 4338),
        (gen_random_uuid(), 'brahmin_hill', 19, 21),
        (gen_random_uuid(), 'magar', 4980, 5821),
        (gen_random_uuid(), 'newar', 27, 30),
        (gen_random_uuid(), 'bishwakarma', 759, 921),
        (gen_random_uuid(), 'pariyar', 352, 402),
        (gen_random_uuid(), 'thakuri', 29, 43),
        (gen_random_uuid(), 'sanyasi_dasnami', 24, 24),
        (gen_random_uuid(), 'mallaha', 6, 6),
        (gen_random_uuid(), 'hajam_thakur', 4, 9),
        (gen_random_uuid(), 'badi', 31, 35),
        (gen_random_uuid(), 'other', 25, 36);
    END IF;
END
$$;
