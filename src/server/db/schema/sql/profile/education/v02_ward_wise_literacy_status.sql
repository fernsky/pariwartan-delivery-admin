-- Check if acme_ward_wise_literacy_status table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables WHERE tablename = 'acme_ward_wise_literacy_status'
    ) THEN
        CREATE TABLE acme_ward_wise_literacy_status (
            id VARCHAR(36) PRIMARY KEY,
            ward_number INTEGER NOT NULL,
            gender VARCHAR(10) NOT NULL,
            literacy_type VARCHAR(100) NOT NULL,
            population INTEGER NOT NULL,
            updated_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END
$$;

-- Insert seed data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM acme_ward_wise_literacy_status) THEN
        INSERT INTO acme_ward_wise_literacy_status (
            id, ward_number, gender, literacy_type, population
        )
        VALUES
        -- Ward 1
        (gen_random_uuid(), 1, 'MALE', 'BOTH_READING_AND_WRITING', 1920),
        (gen_random_uuid(), 1, 'MALE', 'READING_ONLY', 1),
        (gen_random_uuid(), 1, 'MALE', 'ILLITERATE', 715),
        (gen_random_uuid(), 1, 'MALE', 'NOT_MENTIONED', 0),
        (gen_random_uuid(), 1, 'FEMALE', 'BOTH_READING_AND_WRITING', 1013),
        (gen_random_uuid(), 1, 'FEMALE', 'READING_ONLY', 1),
        (gen_random_uuid(), 1, 'FEMALE', 'ILLITERATE', 184),
        (gen_random_uuid(), 1, 'FEMALE', 'NOT_MENTIONED', 0),
        (gen_random_uuid(), 1, 'TOTAL', 'BOTH_READING_AND_WRITING', 907),
        (gen_random_uuid(), 1, 'TOTAL', 'READING_ONLY', 0),
        (gen_random_uuid(), 1, 'TOTAL', 'ILLITERATE', 531),
        (gen_random_uuid(), 1, 'TOTAL', 'NOT_MENTIONED', 0),
        
        -- Ward 2
        (gen_random_uuid(), 2, 'MALE', 'BOTH_READING_AND_WRITING', 3364),
        (gen_random_uuid(), 2, 'MALE', 'READING_ONLY', 3),
        (gen_random_uuid(), 2, 'MALE', 'ILLITERATE', 1044),
        (gen_random_uuid(), 2, 'MALE', 'NOT_MENTIONED', 3),
        (gen_random_uuid(), 2, 'FEMALE', 'BOTH_READING_AND_WRITING', 1676),
        (gen_random_uuid(), 2, 'FEMALE', 'READING_ONLY', 2),
        (gen_random_uuid(), 2, 'FEMALE', 'ILLITERATE', 315),
        (gen_random_uuid(), 2, 'FEMALE', 'NOT_MENTIONED', 1),
        (gen_random_uuid(), 2, 'TOTAL', 'BOTH_READING_AND_WRITING', 1688),
        (gen_random_uuid(), 2, 'TOTAL', 'READING_ONLY', 1),
        (gen_random_uuid(), 2, 'TOTAL', 'ILLITERATE', 729),
        (gen_random_uuid(), 2, 'TOTAL', 'NOT_MENTIONED', 2),
        
        -- Ward 3
        (gen_random_uuid(), 3, 'MALE', 'BOTH_READING_AND_WRITING', 2153),
        (gen_random_uuid(), 3, 'MALE', 'READING_ONLY', 6),
        (gen_random_uuid(), 3, 'MALE', 'ILLITERATE', 699),
        (gen_random_uuid(), 3, 'MALE', 'NOT_MENTIONED', 0),
        (gen_random_uuid(), 3, 'FEMALE', 'BOTH_READING_AND_WRITING', 1056),
        (gen_random_uuid(), 3, 'FEMALE', 'READING_ONLY', 2),
        (gen_random_uuid(), 3, 'FEMALE', 'ILLITERATE', 214),
        (gen_random_uuid(), 3, 'FEMALE', 'NOT_MENTIONED', 0),
        (gen_random_uuid(), 3, 'TOTAL', 'BOTH_READING_AND_WRITING', 1097),
        (gen_random_uuid(), 3, 'TOTAL', 'READING_ONLY', 4),
        (gen_random_uuid(), 3, 'TOTAL', 'ILLITERATE', 485),
        (gen_random_uuid(), 3, 'TOTAL', 'NOT_MENTIONED', 0),
        
        -- Ward 4
        (gen_random_uuid(), 4, 'MALE', 'BOTH_READING_AND_WRITING', 2649),
        (gen_random_uuid(), 4, 'MALE', 'READING_ONLY', 27),
        (gen_random_uuid(), 4, 'MALE', 'ILLITERATE', 1380),
        (gen_random_uuid(), 4, 'MALE', 'NOT_MENTIONED', 4),
        (gen_random_uuid(), 4, 'FEMALE', 'BOTH_READING_AND_WRITING', 1272),
        (gen_random_uuid(), 4, 'FEMALE', 'READING_ONLY', 7),
        (gen_random_uuid(), 4, 'FEMALE', 'ILLITERATE', 576),
        (gen_random_uuid(), 4, 'FEMALE', 'NOT_MENTIONED', 2),
        (gen_random_uuid(), 4, 'TOTAL', 'BOTH_READING_AND_WRITING', 1377),
        (gen_random_uuid(), 4, 'TOTAL', 'READING_ONLY', 20),
        (gen_random_uuid(), 4, 'TOTAL', 'ILLITERATE', 804),
        (gen_random_uuid(), 4, 'TOTAL', 'NOT_MENTIONED', 2),
        
        -- Ward 5
        (gen_random_uuid(), 5, 'MALE', 'BOTH_READING_AND_WRITING', 2818),
        (gen_random_uuid(), 5, 'MALE', 'READING_ONLY', 8),
        (gen_random_uuid(), 5, 'MALE', 'ILLITERATE', 736),
        (gen_random_uuid(), 5, 'MALE', 'NOT_MENTIONED', 2),
        (gen_random_uuid(), 5, 'FEMALE', 'BOTH_READING_AND_WRITING', 1417),
        (gen_random_uuid(), 5, 'FEMALE', 'READING_ONLY', 1),
        (gen_random_uuid(), 5, 'FEMALE', 'ILLITERATE', 229),
        (gen_random_uuid(), 5, 'FEMALE', 'NOT_MENTIONED', 0),
        (gen_random_uuid(), 5, 'TOTAL', 'BOTH_READING_AND_WRITING', 1401),
        (gen_random_uuid(), 5, 'TOTAL', 'READING_ONLY', 7),
        (gen_random_uuid(), 5, 'TOTAL', 'ILLITERATE', 507),
        (gen_random_uuid(), 5, 'TOTAL', 'NOT_MENTIONED', 2),
        
        -- Ward 6
        (gen_random_uuid(), 6, 'MALE', 'BOTH_READING_AND_WRITING', 1564),
        (gen_random_uuid(), 6, 'MALE', 'READING_ONLY', 18),
        (gen_random_uuid(), 6, 'MALE', 'ILLITERATE', 463),
        (gen_random_uuid(), 6, 'MALE', 'NOT_MENTIONED', 3),
        (gen_random_uuid(), 6, 'FEMALE', 'BOTH_READING_AND_WRITING', 827),
        (gen_random_uuid(), 6, 'FEMALE', 'READING_ONLY', 7),
        (gen_random_uuid(), 6, 'FEMALE', 'ILLITERATE', 129),
        (gen_random_uuid(), 6, 'FEMALE', 'NOT_MENTIONED', 2),
        (gen_random_uuid(), 6, 'TOTAL', 'BOTH_READING_AND_WRITING', 737),
        (gen_random_uuid(), 6, 'TOTAL', 'READING_ONLY', 11),
        (gen_random_uuid(), 6, 'TOTAL', 'ILLITERATE', 334),
        (gen_random_uuid(), 6, 'TOTAL', 'NOT_MENTIONED', 1);
    END IF;
END
$$;
